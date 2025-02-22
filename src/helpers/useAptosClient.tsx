import {
  AddContributionFunctionInput,
  Contribution,
  CreateCampaignFunctionInput,
  GetCampaignFunctionContractResponse,
  GetSubscriptionStatusResponse,
} from "@/types/Contract";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  convertBalance,
  functionAccessStringCreator,
  parseCampaignResponse,
} from "./api/campaignHelpers";

const ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS_WITH_0X_PREFIX;
if (!ACCOUNT_ADDRESS)
  throw new Error("NEXT_PUBLIC_MODULE_ADDRESS_WITH_0X_PREFIX is not set");

export function useAptosClient() {
  const {
    account,
    signAndSubmitTransaction,
    network: networkFromAdaptor,
    isLoading: isWalletLoading,
  } = useWallet();

  const [isAptosClientReady, setIsAptosClientReady] = useState(false);

  const aptosConfig = useMemo(() => {
    if (!networkFromAdaptor) return null;

    if (!networkFromAdaptor.url) {
      console.error("Network URL (Full Node) not found.");
      return null;
    }

    const newAptosConfig = new AptosConfig({
      network: Network.CUSTOM,
      fullnode: networkFromAdaptor.url,
    });

    return newAptosConfig;
  }, [networkFromAdaptor]);

  const aptosClient = useMemo(() => {
    if (!aptosConfig || isWalletLoading) return null;
    return new Aptos(aptosConfig);
  }, [aptosConfig, isWalletLoading]);

  const currentNetworkName = useMemo(() => {
    const url = networkFromAdaptor?.url;
    if (!url) return null;

    if (url === process.env.NEXT_PUBLIC_MOVEMENT_TEST_NETWORK_PORTO_URL)
      return "testnet";
    else if (url === process.env.NEXT_PUBLIC_MOVEMENT_MAIN_NETWORK_URL)
      return "mainnet";
    else return null;
  }, [networkFromAdaptor]);

  // Managing isAptosClientReady state.
  useEffect(() => {
    if (!aptosClient || !aptosConfig || isWalletLoading)
      return setIsAptosClientReady(false);

    setIsAptosClientReady(true);
  }, [aptosClient, aptosConfig, isWalletLoading]);

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
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "create_campaign",
    });

    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: accessFunctionString,
          functionArguments: [
            functionInput.title,
            functionInput.description,
            functionInput.dataSpec,
            functionInput.unitPrice.toString(),
            functionInput.minimumContribution.toString(),
            functionInput.minimumScore.toString(),
            functionInput.rewardPool.toString(),
            functionInput.publicKeyForEncryption,
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

  const addContribution = async (
    functionInput: AddContributionFunctionInput
  ) => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const functionAccessString = functionAccessStringCreator({
      moduleName: "contribution_manager",
      functionName: "add_contribution",
    });
    if (!functionAccessString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: functionAccessString,
          functionArguments: [
            functionInput.campaignId.toString(),
            functionInput.dataCount.toString(),
            functionInput.store_key,
            functionInput.score.toString(),
            functionInput.keyForDecryption,
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

  const getAllCampaigns = async () => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "get_all_campaigns",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
          functionArguments: [],
          typeArguments: [],
        },
      });

      if (!response[0]) {
        console.error("Error on getting campaigns: ", response);
        return false;
      }

      return (response[0] as GetCampaignFunctionContractResponse[]).map(
        parseCampaignResponse
      );
    } catch (error) {
      handleError(error, "fetching campaigns");
      return false;
    }
  };

  const getCampaignData = async (campaignId: string) => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "get_campaign",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
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
      handleError(error, "fetching campaign data");
      return false;
    }
  };

  const getContributions = async (campaignId: string) => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "contribution_manager",
      functionName: "get_campaign_contributions",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
          functionArguments: [campaignId.toString()],
        },
      });

      if (!response[0]) {
        console.error("Error on getting contributions: ", campaignId, response);
        return false;
      }

      const contributions = response[0] as {
        campaign_id: number;
        contributor: string;
        data_count: number;
        store_cid: string;
        score: number;
        key_for_decryption: string;
      }[];

      return contributions.map((c) => {
        const data: Contribution = {
          campaignId: Number(c.campaign_id),
          contributor: c.contributor,
          dataCount: Number(c.data_count),
          score: Number(c.score),
          storeCid: c.store_cid,
          keyForDecryption: c.key_for_decryption,
        };
        return data;
      });
    } catch (error) {
      handleError(error, "fetching contributions");
      return false;
    }
  };

  const subscribePremium = async () => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "subscription_manager",
      functionName: "subscribe",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    try {
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: accessFunctionString,
          functionArguments: [],
        },
      });

      await aptosClient.waitForTransaction({
        transactionHash: signAndSubmitResult.hash,
      });
      toast.success("Subscribed to premium successfully!");
      return true;
    } catch (error) {
      handleError(error, "subscribing to premium");
      return false;
    }
  };

  const getSubscriptionStatus = async () => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "subscription_manager",
      functionName: "check_subscription",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    if (!account?.address) {
      console.error("Account address not found.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
          functionArguments: [account.address],
        },
      });

      const status = (response[0] as boolean) || false;
      const remainingTime = (response[1] as number) || 0;

      const functionResponse: GetSubscriptionStatusResponse = {
        status,
        remainingTime,
      };

      return functionResponse;
    } catch (error) {
      handleError(error, "fetching subscription status");
      return false;
    }
  };

  const getBalanceOfAccount = async () => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "mamu",
      functionName: "get_balance",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    if (!account?.address) {
      console.error("Account address not found.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
          functionArguments: [account.address],
        },
      });

      return convertBalance(response[0] as number);
    } catch (error) {
      handleError(error, "fetching account balance");
      return false;
    }
  };

  return {
    createCampaign,
    getAllCampaigns,
    getCampaignData,
    addContribution,
    isAptosClientReady,
    getContributions,
    subscribePremium,
    getSubscriptionStatus,
    currentNetworkName,
    getBalanceOfAccount,
  };
}
