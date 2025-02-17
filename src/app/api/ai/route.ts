import { GoogleGenerativeAI } from "@google/generative-ai";
import { createCipheriv, createHash, randomBytes, subtle } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

import { AIAnalysisResponse } from "@/types/API";
import { PinataSDK } from "pinata-web3";

import { aptosClient } from "@/helpers/api/aptosClient";
import {
  functionAccessStringCreator,
  parseCampaignResponse,
} from "@/helpers/api/campaignHelpers";
import { GetCampaignFunctionContractResponse } from "@/types/Contract";

async function getCampaignData(campaignId: number) {
  try {
    const functionAccessString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "get_campaign",
    });
    if (!functionAccessString) {
      throw new Error("Error creating function access string. See other logs.");
    }

    const response = await aptosClient.view({
      payload: {
        function: functionAccessString,
        functionArguments: [campaignId.toString()],
      },
    });

    if (!response[0]) {
      console.error("Error on getting campaign: ", campaignId, response);
      return false;
    }

    return parseCampaignResponse(
      response[0] as GetCampaignFunctionContractResponse
    );
  } catch (error) {
    console.error("Error getting campaign data:", error);
    return false;
  }
}

async function createContentStringData(file: File) {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const jsonData = JSON.parse(fileBuffer.toString());
    const fileContentsString = JSON.stringify(JSON.stringify(jsonData));
    return fileContentsString;
  } catch (error) {
    console.error("Error creating content string data:", error);
    return false;
  }
}

async function getScoreFromAI(fileContentsString: string, dataSpec: string) {
  const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY as string
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
  });

  try {
    const prompt = `Analyze the following JSON document and provide a reality/quality score from 0 to 100. 
    Consider factors like: ${dataSpec}
    
    Return ONLY the numerical score: ${fileContentsString}`;

    const result = await model.generateContent(prompt);
    const score = result.response.text();

    const numberScore = Number(score.trim());
    if (isNaN(numberScore) || numberScore < 0 || numberScore > 100) {
      throw new Error("Invalid score returned from AI: " + score);
    }

    return numberScore;
  } catch (error) {
    console.error("Error getting score from AI:", error);
    return false;
  }
}

function getWordCount(str: string): number {
  // Split the string by spaces and filter out empty strings
  const words = str.split(/\s+/).filter((word) => word.length > 0);
  // Return the length of the filtered array
  return words.length;
}

async function encryptContent(content: string) {
  const key = randomBytes(32); // Generate a 256-bit (32-byte) key
  const iv = randomBytes(16); // Generate a 16-byte IV

  try {
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(content, "utf-8"),
      cipher.final(),
    ]);

    return {
      encryptedData: iv.toString("hex") + ":" + encrypted.toString("hex"),
      aesKey: key.toString("hex"), // You'll need this key for decryption
    };
  } catch (error) {
    console.error("Error encrypting content:", error);
    return false;
  }
}

async function createEncryptedFile(content: string) {
  const encryptionResult = await encryptContent(content);
  if (!encryptionResult) {
    return false;
  }

  try {
    const blob = new Blob([encryptionResult.encryptedData], {
      type: "text/plain",
    });

    const fileName = Date.now().toString();
    const newFile = new File([blob], fileName);

    return {
      file: newFile,
      aesKey: encryptionResult.aesKey,
    };
  } catch (error) {
    console.error("Error creating encrypted file:", error);
    return false;
  }
}

/**
 *
 * @param campaignId
 * @returns Public key in hex format.
 */
async function getPublicKeyForEncryption(campaignId: number) {
  try {
    const functionAccessString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "get_public_key_for_encryption",
    });
    if (!functionAccessString) {
      throw new Error("Error creating function access string. See other logs.");
    }

    const response = await aptosClient.view({
      payload: {
        function: functionAccessString,
        functionArguments: [campaignId.toString()],
      },
    });

    if (!response[0]) {
      console.error("Error on getting public key: ", campaignId, response);
      return false;
    }

    return response[0] as string;
  } catch (error) {
    console.error("Error getting public key for encryption:", error);
    return false;
  }
}

/**
 *
 * @param hexPublicKey
 * @param aesKey
 * @returns encrypted AES key in utf-8 format.
 */
async function encryptAESKey(hexPublicKey: string, aesKey: string) {
  try {
    // Remove "0x" prefix if present.
    if (hexPublicKey.startsWith("0x")) {
      hexPublicKey = hexPublicKey.slice(2);
    }
    // Convert the hex string to an ArrayBuffer.
    const keyBuffer = Buffer.from(hexPublicKey, "hex");

    const importedPublicKey = await subtle.importKey(
      "spki",
      keyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"]
    );

    const data = new TextEncoder().encode(aesKey);
    const encrypted = await subtle.encrypt(
      { name: "RSA-OAEP" },
      importedPublicKey,
      data
    );

    return Buffer.from(encrypted).toString("hex");
  } catch (error) {
    console.error("Error encrypting content:", error);
    return false;
  }
}

function signData(
  dataSenderPublicAddressHex: string,
  campaignId: number,
  dataCount: number,
  ipfsCID: string,
  score: number,
  encryptedAESKeyHex: string
) {
  try {
    // Convert parameters
    const sender = Buffer.from(
      dataSenderPublicAddressHex.replace("0x", ""),
      "hex"
    );
    const campaignIdBigInt = BigInt(campaignId); // Ensure u64 format
    const dataCountBigInt = BigInt(dataCount); // Ensure u64 format
    const scoreBigInt = BigInt(score);
    const storeKey = Buffer.from(ipfsCID, "utf-8"); // Adjust encoding if needed
    const encryptedAESKey = Buffer.from(encryptedAESKeyHex, "utf-8");

    // Retrieve and validate private key
    const privateKeyHex =
      process.env.TRUSTED_WALLET_PRIVATE_KEY_WITH_OUT_0X_PREFIX;
    if (
      !privateKeyHex ||
      privateKeyHex.length !== 64 ||
      !/^[0-9a-fA-F]+$/.test(privateKeyHex)
    ) {
      console.error("Invalid private key");
      return false;
    }

    // Create an account using the private key
    const privateKey = new Ed25519PrivateKey(Buffer.from(privateKeyHex, "hex"));
    const account = Account.fromPrivateKey({ privateKey, legacy: false });

    // Manually serialize the data into a buffer
    const message = Buffer.alloc(
      32 + 8 + 8 + 8 + storeKey.length + 8 + 8 + encryptedAESKey.length
    ); // Allocate buffer

    // Serialize sender (bytes) at position 0
    sender.copy(message, 0);

    // Serialize campaignId (u64) at position 0
    message.writeBigUInt64LE(campaignIdBigInt, 32);

    // Serialize dataCount (u64) at position 0
    message.writeBigUInt64LE(dataCountBigInt, 40);

    // Serialize storeKey length (u64) at position 8
    message.writeBigUInt64LE(BigInt(storeKey.length), 48);
    // Serialize storeKey (bytes) at position 16
    storeKey.copy(message, 56);

    // Serialize score (u64) after storeKey
    message.writeBigUInt64LE(scoreBigInt, 56 + storeKey.length);

    // Serialize encryptedAESKey length (u64) after score
    message.writeBigUInt64LE(
      BigInt(encryptedAESKey.length),
      storeKey.length + 64
    );
    // Serialize encryptedAESKey length (u64) after score
    encryptedAESKey.copy(message, storeKey.length + 72);

    // Hash the serialized message using SHA-256
    const messageHash = createHash("sha256").update(message).digest();

    // Sign the hashed message
    const signature = account.sign(messageHash).bcsToBytes();
    const signatureHex = Buffer.from(signature).toString("hex");

    // Return signature for Move test function
    return signatureHex.slice(4);
  } catch (error) {
    console.error("Error signing test data:", error);
    return false;
  }
}

async function uploadToIPFS(data: File) {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
  });

  try {
    const response = await pinata.upload.file(data);
    return response.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure the request has a file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const campaignId = formData.get("campaignId") as string;
    const dataSenderPublicAddressHex = formData.get(
      "dataSenderPublicAddressHex"
    ) as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!campaignId) {
      return NextResponse.json(
        { message: "No campaignId provided" },
        { status: 400 }
      );
    }

    if (!dataSenderPublicAddressHex) {
      return NextResponse.json(
        { message: "No dataSenderPublicAddressHex provided" },
        { status: 400 }
      );
    }

    const campaignData = await getCampaignData(Number(campaignId));
    if (!campaignData) {
      return NextResponse.json(
        { message: "Error getting campaign data" },
        { status: 500 }
      );
    }

    const fileContentsString = await createContentStringData(file);
    if (!fileContentsString) {
      return NextResponse.json(
        {
          error: "Error processing file",
          details: "Invalid file contents",
        },
        { status: 500 }
      );
    }

    // Generate quality score
    const score = await getScoreFromAI(
      fileContentsString,
      campaignData.data_spec
    );

    if (score === false) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const contentLength = getWordCount(fileContentsString);

    // Encrypt the content
    const encryptionResult = await createEncryptedFile(fileContentsString);
    if (!encryptionResult) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const hexPublicKey = await getPublicKeyForEncryption(campaignData.id);
    if (!hexPublicKey) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const encryptedAESKey = await encryptAESKey(
      hexPublicKey,
      encryptionResult.aesKey
    );
    if (!encryptedAESKey) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const ipfsCID = await uploadToIPFS(encryptionResult.file);
    if (!ipfsCID) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const signature = signData(
      dataSenderPublicAddressHex,
      Number(campaignId),
      contentLength,
      ipfsCID,
      score,
      encryptedAESKey
    );
    if (!signature) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const response: AIAnalysisResponse = {
      campaignId: Number(campaignId),
      contentLength: contentLength,
      ipfsCID: ipfsCID,
      score: score,
      keyForDecryption: encryptedAESKey,
      signature: signature,
    };

    // Return the quality score
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      {
        error: "Error processing file",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
