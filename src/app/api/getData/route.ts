import { aptosClient } from "@/helpers/api/aptosClient";
import {
  functionAccessStringCreator,
  parseCampaignResponse,
} from "@/helpers/api/campaignHelpers";
import { Ed25519PublicKey, Ed25519Signature } from "@aptos-labs/ts-sdk";

import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata-web3";

import { createDecipheriv } from "crypto";

async function verifySignature(
  publicKey: string,
  signature: string,
  fullMessage: string
) {
  try {
    const pubKey = new Ed25519PublicKey(publicKey);
    const signatureObj = new Ed25519Signature(signature);
    const encodedMessage = new TextEncoder().encode(fullMessage);

    const result = pubKey.verifySignature({
      message: encodedMessage,
      signature: signatureObj,
    });

    return result;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

async function getCampaignData(campaignId: number) {
  try {
    const functionAccessString = functionAccessStringCreator(
      "campaign_manager",
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

function computePublicAddressOfSigner(pubkey: string) {
  try {
    const acc = new Ed25519PublicKey(pubkey);
    return acc.authKey().toString();
  } catch (error) {
    console.error("Error computing public address of signer:", error);
    return false;
  }
}

function isAuthorizedToGetCampaignData(
  campaignCreatorPublicAddress: string,
  publicAddressOfSigner: string
) {
  return campaignCreatorPublicAddress === publicAddressOfSigner;
}

async function getDataFromIPFS(cid: string) {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    });

    const response = await pinata.gateways.get(cid);

    const data = response.data;
    if (!data) {
      console.error("Data is undefined at IPFS.: ", cid);
      return false;
    }

    return data.toString();
  } catch (error) {
    console.error("Error getting data from IPFS:", error);
    return false;
  }
}

function decryptContent(encryptedContent: string) {
  const key = process.env.MAIN_ENCRYPTION_KEY || "";
  if (!key) {
    console.error("No main encryption key found");
    return false;
  }

  try {
    const contentParts = encryptedContent.split(":");

    const ivPart = contentParts.shift();
    if (!ivPart) {
      throw new Error("IV not found");
    }

    const iv = Buffer.from(ivPart, "hex");
    const encryptedPart = Buffer.from(contentParts.join(":"), "hex");

    const keyBuffer = Buffer.from(key, "hex");
    const decipher = createDecipheriv(
      "aes-256-cbc",
      Buffer.from(keyBuffer),
      iv
    );

    const decrypted = Buffer.concat([
      decipher.update(encryptedPart),
      decipher.final(),
    ]);

    return decrypted.toString("utf-8");
  } catch (error) {
    console.error("Error decrypting content:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    let { publicKey, signature, fullMessage, campaignId } =
      await request.json();

    if (!publicKey || !signature || !fullMessage || !campaignId) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        { status: 422 }
      );
    }

    const isValidSignature = await verifySignature(
      publicKey,
      signature,
      fullMessage
    );
    if (!isValidSignature) {
      return NextResponse.json(
        {
          message: "Invalid signature",
        },
        { status: 401 }
      );
    }

    const campaignData = await getCampaignData(campaignId);
    if (!campaignData) {
      return NextResponse.json(
        {
          message: "Error getting campaign data",
        },
        { status: 500 }
      );
    }

    const signerPublicAddress = computePublicAddressOfSigner(publicKey);
    if (!signerPublicAddress) {
      return NextResponse.json(
        {
          message: "Error computing public address of signer",
        },
        { status: 500 }
      );
    }

    const isAuthorized = isAuthorizedToGetCampaignData(
      campaignData.creator,
      signerPublicAddress
    );
    if (!isAuthorized) {
      return NextResponse.json(
        {
          message: "Unauthorized to access campaign data",
        },
        { status: 403 }
      );
    }

    const data = await getDataFromIPFS(process.env.HARDOCODED_CID || "");
    if (!data) {
      return NextResponse.json(
        {
          message: "Error getting data from IPFS",
        },
        { status: 500 }
      );
    }

    const decryptedData = decryptContent(data);
    if (!decryptedData) {
      return NextResponse.json(
        {
          message: "Error decrypting data",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: decryptedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new NextResponse("Error processing request", { status: 500 });
  }
}
