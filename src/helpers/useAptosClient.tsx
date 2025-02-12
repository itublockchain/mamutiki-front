import {
  AddContributionFunctionInput,
  CreateCampaignFunctionInput,
  GetCampaignFunctionResponse,
} from "@/types/Contract";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS;
if (!ACCOUNT_ADDRESS) throw new Error("NEXT_PUBLIC_ACCOUNT_ADDRESS is not set");

export function useAptosClient() {
  const {
    signAndSubmitTransaction,
    network: networkFromAdaptor,
    isLoading: isWalletLoading,
  } = useWallet();

  const lastNetworkRef = useRef<Network | null>(null);

  const [isAptosClientReady, setIsAptosClientReady] = useState(false);

  const network = useMemo(() => {
    if (!networkFromAdaptor) return null;

    const networkMap = {
      custom: Network.DEVNET,
      testnet: Network.TESTNET,
      mainnet: Network.MAINNET,
      devnet: Network.DEVNET,
    };

    return networkMap[networkFromAdaptor.name as keyof typeof networkMap];
  }, [networkFromAdaptor]);

  const aptosClient = useMemo(() => {
    if (!network || isWalletLoading) return null;
    return new Aptos(new AptosConfig({ network }));
  }, [network, isWalletLoading]);

  // Managing lastNetworkRef to prevent multiple toasts.
  useEffect(() => {
    if (isWalletLoading || network === lastNetworkRef.current) return;

    toast.success(`Network changed to ${network}`);
    lastNetworkRef.current = network;
  }, [network, isWalletLoading]);

  // Managing isAptosClientReady state.
  useEffect(() => {
    if (!aptosClient || !network || isWalletLoading)
      return setIsAptosClientReady(false);

    setIsAptosClientReady(true);
  }, [aptosClient, network, isWalletLoading]);

  const functionAccessStringCreator = (
    moduleName: string,
    functionName: string
  ): `${string}::${string}::${string}` => {
    return `${ACCOUNT_ADDRESS}::${moduleName}::${functionName}`;
  };

  const getParsedError = (error: string) => {
    try {
      return JSON.parse(error) as {
        message: string;
        error_code: string;
        vm_error_code: string;
      };
    } catch {
      return {
        message: "Unknown error",
        error_code: "Unknown error",
        vm_error_code: "Unknown error",
      };
    }
  };

  const parseCampaignResponse = (
    response: any
  ): GetCampaignFunctionResponse => {
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

  const handleError = (error: unknown, context: string) => {
    if (error === "User Rejected the request") {
      toast.error("Request rejected by the user.");
      return;
    }

    const parsedError = getParsedError(error as string);
    toast.error(`An error occurred while ${context}: \n${parsedError.message}`);
    console.error(`Error on ${context}: `, error);
  };

  const createCampaign = async (functionInput: CreateCampaignFunctionInput) => {
    if (!aptosClient || !network) {
      toast.error("Network is not set.");
      return false;
    }

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: functionAccessStringCreator(
            "CampaignManager",
            "create_campaign"
          ),
          functionArguments: [
            Array.from(Buffer.from(functionInput.title)),
            Array.from(Buffer.from(functionInput.description)),
            Array.from(Buffer.from(functionInput.dataSpec)),
            functionInput.unitPrice.toString(),
            functionInput.rewardPool.toString(),
          ],
        },
      });

      await aptosClient.waitForTransaction({
        transactionHash: signAndSubmitResult.hash,
      });
      toast.success("Campaign created successfully!");
      return true;
    } catch (error) {
      handleError(error, "creating campaign");
      return false;
    }
  };

  const getAllCampaigns = async () => {
    if (!aptosClient || !network) {
      toast.error("Network is not set.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: functionAccessStringCreator(
            "CampaignManager",
            "get_all_campaigns"
          ),
          functionArguments: [],
          typeArguments: [],
        },
      });

      if (!response[0]) {
        console.error("Error on getting campaigns: ", response);
        return false;
      }

      return (response[0] as any[]).map(parseCampaignResponse);
    } catch (error) {
      handleError(error, "fetching campaigns");
      return false;
    }
  };

  const getCampaignData = async (campaignId: string) => {
    if (!aptosClient || !network) {
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: functionAccessStringCreator(
            "CampaignManager",
            "get_campaign"
          ),
          functionArguments: [campaignId.toString()],
        },
      });

      if (!response[0]) {
        console.error("Error on getting campaign: ", campaignId, response);
        return false;
      }

      return parseCampaignResponse(response[0]);
    } catch (error) {
      handleError(error, "fetching campaign data");
      return false;
    }
  };

  const addContribution = async (
    functionInput: AddContributionFunctionInput
  ) => {
    if (!aptosClient || !network) {
      toast.error("Network is not set.");
      return false;
    }

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: functionAccessStringCreator(
            "ContributionManager",
            "add_contribution"
          ),
          functionArguments: [
            functionInput.campaignId.toString(),
            functionInput.dataCount.toString(),
            Array.from(Buffer.from(functionInput.store_key)),
            functionInput.score.toString(),
            Array.from(Buffer.from(functionInput.sign, "hex")),
          ],
        },
      });

      await aptosClient.waitForTransaction({
        transactionHash: signAndSubmitResult.hash,
      });
      toast.success("Data submitted successfully");
      return true;
    } catch (error) {
      handleError(error, "submitting data");
      return false;
    }
  };

  return {
    createCampaign,
    getAllCampaigns,
    getCampaignData,
    addContribution,
    isAptosClientReady,
  };
}
