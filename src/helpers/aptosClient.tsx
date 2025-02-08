import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  AccountInfo,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";

const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

export async function createCampaign(
  account: AccountInfo,
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  dataSpec: string,
  qualityCretaria: string,
  rewardPool: number
) {
  const config = new AptosConfig({ network: Network.DEVNET });
  const aptosClient = new Aptos(config);

  try {
    const signAndSubmitResult = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MODULE_ADDRESS}::CampaignManager::create_campaign`,
        functionArguments: [
          Array.from(Buffer.from(dataSpec)),
          Array.from(Buffer.from(qualityCretaria)),
          rewardPool.toString(),
        ],
      },
    });

    console.log("signAndSubmit Result: ", signAndSubmitResult);

    const executedTx = await aptosClient.waitForTransaction({
      transactionHash: signAndSubmitResult.hash,
    });

    console.log("Executed Tx: ", executedTx);

    return true;
  } catch (error) {
    console.error("Error on creating campaign: ", error);
    return false;
  }
}
