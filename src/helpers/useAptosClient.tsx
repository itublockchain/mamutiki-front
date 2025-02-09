import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS;
if (!ACCOUNT_ADDRESS) throw new Error("NEXT_PUBLIC_ACCOUNT_ADDRESS is not set");

export function useAptosClient() {
  const { signAndSubmitTransaction, network: networkFromAdaptor } = useWallet();

  const [network, setNetwork] = useState<
    Network.DEVNET | Network.TESTNET | Network.MAINNET | undefined
  >(undefined);

  useEffect(() => {
    if (!networkFromAdaptor) return setNetwork(undefined);

    const name = networkFromAdaptor.name as "mainnet" | "testnet" | "custom";

    if (name === "custom") {
      setNetwork(Network.DEVNET);
      toast.success("Network changed to " + "devnet");
    } else if (name === "testnet") {
      setNetwork(Network.TESTNET);
      toast.success("Network changed to " + "testnet");
    } else if (name === "mainnet") {
      setNetwork(Network.MAINNET);
      toast.success("Network changed to " + "mainnet");
    } else {
      setNetwork(undefined);
      toast.error("Selected network not supported.");
    }
  }, [networkFromAdaptor]);

  async function createCampaign(
    dataSpec: string,
    qualityCretaria: string,
    rewardPool: number
  ) {
    if (!network) {
      console.error("Network is not set.");
      toast.error("Network is not set.");
      return false;
    }

    const config = new AptosConfig({ network: network });
    const aptosClient = new Aptos(config);

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: functionAccessStringCreator(
            "CampaignManager",
            "create_campaign"
          ),
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

      toast.success("Campaign created successfully!");

      return true;
    } catch (error) {
      const parsedError = getParsedError(error as string);

      toast.error(
        //@ts-ignore
        "An error occured while creating campaign: \n" + parsedError.message
      );
      console.error("Error on creating campaign: ", error);
      return false;
    }
  }

  function functionAccessStringCreator(
    moduleName: string,
    functionName: string
  ): `${string}::${string}::${string}` {
    return `${ACCOUNT_ADDRESS}::${moduleName}::${functionName}`;
  }

  function getParsedError(error: string): {
    message: string;
    error_code: string;
    vm_error_code: string;
  } {
    try {
      const parsedError = JSON.parse(error) as {
        message: string;
        error_code: string;
        vm_error_code: string;
      };

      return parsedError;
    } catch (error) {
      return {
        message: "Unknown error",
        error_code: "Unknown error",
        vm_error_code: "Unknown error",
      };
    }
  }

  return {
    createCampaign,
  };
}
