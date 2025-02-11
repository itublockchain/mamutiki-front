import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import { GetCampaignFunctionResponse } from "@/types/Contract";

import { PinataSDK } from "pinata-web3";
import { AIAnalysisResponse } from "@/types/API";

const parseCampaignResponse = (response: any): GetCampaignFunctionResponse => {
  const hexToUtf8 = (hexString: string) => {
    if (hexString.startsWith("0x")) {
      hexString = hexString.slice(2);
    }
    return Buffer.from(hexString, "hex").toString("utf-8");
  };

  return {
    id: Number(response.id),
    title: hexToUtf8(response.title),
    description: hexToUtf8(response.description),
    creator: response.creator,
    data_spec: hexToUtf8(response.data_spec),
    reward_pool: Number(response.reward_pool) / 100000000,
    remaining_reward: Number(response.remaining_reward) / 100000000,
    unit_price: Number(response.unit_price) / 100000000,
    active: response.active,
  };
};

async function getCampaignData(campaignId: number) {
  try {
    const aptosClient = new Aptos(new AptosConfig({ network: Network.DEVNET }));

    const functionAccessString = functionAccessStringCreator(
      "CampaignManager",
      "get_campaign"
    );
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

    return parseCampaignResponse(response[0]);
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
    model: "gemini-2.0-pro-exp-02-05",
    generationConfig: {
      temperature: 1,
    },
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

async function signData(
  campaignId: number,
  dataCount: number,
  ipfsCID: string,
  score: number
) {
  try {
    // Convert parameters
    const campaignIdBigInt = BigInt(campaignId); // Ensure u64 format
    const dataCountBigInt = BigInt(dataCount); // Ensure u64 format
    const scoreBigInt = BigInt(score);
    const storeKey = Buffer.from(ipfsCID, "utf-8"); // Adjust encoding if needed

    // Retrieve and validate private key
    const privateKeyHex = process.env.PRIVATE_KEY;
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
    const message = Buffer.alloc(8 + 8 + 8 + storeKey.length + 8); // Allocate buffer

    // Serialize campaignId (u64) at position 0
    message.writeBigUInt64LE(campaignIdBigInt, 0);

    // Serialize dataCount (u64) at position 0
    message.writeBigUInt64LE(dataCountBigInt, 8);

    // Serialize storeKey length (u64) at position 8
    message.writeBigUInt64LE(BigInt(storeKey.length), 16);

    // Serialize storeKey (bytes) at position 16
    storeKey.copy(message, 24);

    // Serialize score (u64) after storeKey
    message.writeBigUInt64LE(scoreBigInt, 24 + storeKey.length);

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

const functionAccessStringCreator = (
  moduleName: string,
  functionName: string
): `${string}::${string}::${string}` | false => {
  const accountAddress = process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS || "";
  if (!accountAddress) {
    console.error("Account address not found from .env file");
    return false;
  }

  return `${accountAddress}::${moduleName}::${functionName}`;
};

export async function POST(request: NextRequest) {
  try {
    // Ensure the request has a file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const campaignId = formData.get("campaignId") as string;

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

    const ipfsCID = await uploadToIPFS(file);
    if (!ipfsCID) {
      return NextResponse.json(
        {
          error: "Internal Server Error",
        },
        { status: 500 }
      );
    }

    const signature = await signData(
      Number(campaignId),
      contentLength,
      ipfsCID,
      score
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
