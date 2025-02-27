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
} from "./campaignHelpers";

const ACCOUNT_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ACCOUNT_ADDRESS_WITH_0X_PREFIX;

if (!ACCOUNT_ADDRESS)
  throw new Error(
    "NEXT_PUBLIC_MARKETPLACE_ACCOUNT_ADDRESS_WITH_0X_PREFIX is not set"
  );

export function useAptosClient() {
  const {
    account,
    signAndSubmitTransaction,
    network: networkFromAdaptor,
    isLoading: isWalletLoading,
    connected: isWalletConnected,
  } = useWallet();

  const [isAptosClientReady, setIsAptosClientReady] = useState(false);

  const aptosConfig = useMemo(() => {
    const fullNode = process.env.NEXT_PUBLIC_MOVEMENT_TEST_NETWORK_BARDOCK_URL;

    // if (networkFromAdaptor && networkFromAdaptor.url) {
    //   fullNode = networkFromAdaptor.url;
    // }

    if (!fullNode) {
      console.error(
        "Full Node URL not found on both .env and adaptor (adaptor not activated for test purposes)."
      );
      return null;
    }

    const newAptosConfig = new AptosConfig({
      network: Network.CUSTOM,
      fullnode: fullNode,
    });

    return newAptosConfig;
  }, [networkFromAdaptor]);

  const aptosClient = useMemo(() => {
    if (!aptosConfig || isWalletLoading) return null;
    return new Aptos(aptosConfig);
  }, [aptosConfig, isWalletLoading]);

  // Managing isAptosClientReady state.
  useEffect(() => {
    if (!aptosClient || !aptosConfig || isWalletLoading)
      return setIsAptosClientReady(false);

    setIsAptosClientReady(true);
  }, [aptosClient, aptosConfig, isWalletLoading]);

  const createCampaign = async (functionInput: CreateCampaignFunctionInput) => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    if (!isWalletConnected) {
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
      return true;
    } catch (error) {
      console.error("Error on creating campaign: ", error);

      debugError(error);

      return false;
    }
  };

  const getLastCreatedCampaignOfCurrentUser = async () => {
    if (!aptosClient) {
      toast.error("AptosClient is not ready.");
      return false;
    }

    if (!isWalletConnected) {
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "last_created_campaign",
    });
    if (!accessFunctionString) {
      console.error("Error creating function access string. See other logs.");
      return false;
    }

    const currentUserAccountAddress = account?.address;
    if (!currentUserAccountAddress) {
      console.error("currentUserAccountAddress not found.");
      return false;
    }

    try {
      const response = await aptosClient.view({
        payload: {
          function: accessFunctionString,
          functionArguments: [currentUserAccountAddress],
        },
      });

      if (!response[0]) {
        console.error("Error on getting last created campaign: ", response);
        return false;
      }

      return parseCampaignResponse(
        response[0] as GetCampaignFunctionContractResponse
      );
    } catch (error) {
      console.error("Error: ", error);

      debugError(error);

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

    if (!isWalletConnected) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getAllCampaigns = async () => {
    if (!aptosClient) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getAllActiveCampaings = async () => {
    if (!aptosClient) {
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "campaign_manager",
      functionName: "get_all_active_campaigns",
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getCampaignData = async (campaignId: string) => {
    if (!aptosClient) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getContributions = async (campaignId: string) => {
    if (!aptosClient) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const subscribePremium = async () => {
    if (!aptosClient) {
      return false;
    }

    if (!isWalletConnected) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getSubscriptionStatus = async () => {
    if (!aptosClient) {
      return false;
    }

    if (!isWalletConnected) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getBalanceOfAccount = async () => {
    if (!aptosClient) {
      return false;
    }

    if (!isWalletConnected) {
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
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const getTokensFromFaucet = async () => {
    if (!aptosClient) {
      return false;
    }

    if (!isWalletConnected) {
      return false;
    }

    const accessFunctionString = functionAccessStringCreator({
      moduleName: "mamu",
      functionName: "faucet",
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
      const signAndSubmitResult = await signAndSubmitTransaction({
        data: {
          function: accessFunctionString,
          functionArguments: [],
        },
      });

      await aptosClient.waitForTransaction({
        transactionHash: signAndSubmitResult.hash,
      });
      toast.success("Tokens received from faucet successfully!");
      return true;
    } catch (error) {
      console.error("Error: ", error);

      debugError(error);

      return false;
    }
  };

  const isUsersNetworkCorrect = () => {
    if (!aptosClient) {
      return false;
    }

    if (!isWalletConnected) {
      return false;
    }

    const walletNetworkURL = networkFromAdaptor?.url || "";
    if (!walletNetworkURL) {
      console.error("Wallet network URL not found.");
      return false;
    }

    const currentNetworkURL = aptosConfig?.fullnode || "";
    if (!currentNetworkURL) {
      console.error("Current network URL not found.");
      return false;
    }

    if (walletNetworkURL !== currentNetworkURL) {
      toast.error("Please switch your network to Movement Bardock Testnet.");
      return false;
    }

    return true;
  };

  // @ts-expect-error - Error is not typed.
  const debugError = (error) => {
    if (typeof error === "object") {
      error = JSON.stringify(error);
    }

    error = error.toString();

    if (error.includes("ERR_NOT_ENOUGH_BALANCE")) {
      toast.error("Not enough balance");
    } else if (error.includes("ERR_ESCROW_NOT_FOUND")) {
      toast.error("Escrow not found");
    } else if (error.includes("ERR_UNAUTHORIZED")) {
      toast.error("Unauthorized");
    } else if (error.includes("MIN_FEE_EXCEED")) {
      toast.error("Minimum fee exceed");
    } else if (error.includes("MAX_FEE_EXCEED")) {
      toast.error("Maximum fee exceed");
    } else if (error.includes("MIN_DIVISOR_EXCEED")) {
      toast.error("Minimum divisor exceed");
    } else if (error.includes("ERR_CAMPAIGN_NOT_FOUND")) {
      toast.error("Campaign not found");
    } else if (error.includes("ERR_INVALID_DATA_COUNT")) {
      toast.error("Invalid data count");
    } else if (error.includes("ERR_NO_VALID_SIGNATURE")) {
      toast.error("No valid signature");
    } else if (error.includes("ERR_ALREADY_CONTRIBUTED")) {
      toast.error("Already contributed");
    } else if (error.includes("ERR_INSUFFICIENT_CONTRIBUTION")) {
      toast.error("Insufficient contribution");
    } else if (error.includes("ERR_INSUFFICIENT_SCORE")) {
      toast.error("Insufficient score");
    } else if (error.includes("ERR_INVALID_CAMPAIGN_ID")) {
      toast.error("Invalid campaign id");
    } else if (error.includes("ERR_INVALID_STORE_CID")) {
      toast.error("Invalid store cid");
    } else if (error.includes("ERR_INVALID_SCORE")) {
      toast.error("Invalid score");
    } else if (error.includes("ERR_INVALID_KEY_FOR_DECRYPTION")) {
      toast.error("Invalid key for decryption");
    } else if (error.includes("ERR_INVALID_SIGNATURE")) {
      toast.error("Invalid signature");
    } else if (error.includes("ERR_EXCEED_MAX_SCORE")) {
      toast.error("Exceed max score");
    } else if (error.includes("ERR_NO_SUBSCRIPTION")) {
      toast.error("No subscription");
    } else if (error.includes("ERR_NO_CAMPAIGN")) {
      toast.error("No campaign found");
    } else if (error.includes("ERR_INSUFFICIENT_FUNDS")) {
      toast.error("Insufficient funds");
    } else if (error.includes("ERR_INVALID_TITLE")) {
      toast.error("Invalid title");
    } else if (error.includes("ERR_INVALID_DESCRIPTION")) {
      toast.error("Invalid description");
    } else if (error.includes("ERR_INVALID_PROMPT")) {
      toast.error("Invalid prompt");
    } else if (error.includes("ERR_INVALID_UNIT_PRICE")) {
      toast.error("Invalid unit price");
    } else if (error.includes("ERR_INVALID_MINIMUM_CONTRIBUTION")) {
      toast.error("Invalid minimum contribution");
    } else if (error.includes("ERR_INVALID_MINIMUM_SCORE")) {
      toast.error("Invalid minimum score");
    } else if (error.includes("ERR_INVALID_REWARD_POOL")) {
      toast.error("Invalid reward pool");
    } else if (error.includes("ERR_INVALID_PUBLIC_KEY_FOR_ENCRYPTION")) {
      toast.error("Invalid public key for encryption");
    } else if (error.includes("ERR_EXCEED_MAX_SCORE")) {
      toast.error("Exceed max score");
    } else if (error.includes("ERR_CAMPAIGN_NOT_ACTIVE")) {
      toast.error("Campaign not active");
    } else if (error.includes("ERR_NOT_CAMPAIGN_CREATOR")) {
      toast.error("Not campaign creator");
    } else if (error.includes("ENOT_CREATOR")) {
      toast.error("Not creator");
    } else if (error.includes("EINSUFFICIENT_BALANCE")) {
      toast.error("Insufficient balance");
    } else if (error.includes("EINVALID_PRICE")) {
      toast.error("Invalid price");
    } else if (error.includes("EACTIVE_SUBSCRIPTION_EXISTS")) {
      toast.error("Active subscription exists");
    } else if (error.includes("ERR_NOT_CREATOR")) {
      toast.error("Not creator");
    } else if (error.includes("ERR_KEY_ALREADY_EXISTS")) {
      toast.error("Key already exists");
    } else if (error.includes("ERR_KEY_NOT_FOUND")) {
      toast.error("Key not found");
    } else if (error.includes("account_not_found")) {
      toast.error(
        "Your account is not fully enabled yet. Please transfer some tokens to your account to enable it."
      );
    } else {
      toast.error("An error occurred.");
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
    getBalanceOfAccount,
    getTokensFromFaucet,
    getLastCreatedCampaignOfCurrentUser,
    isUsersNetworkCorrect,
    getAllActiveCampaings,
  };
}
