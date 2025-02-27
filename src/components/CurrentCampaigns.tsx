import { useAptosClient } from "@/helpers/useAptosClient";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export function CurrentCampaigns() {
  const [lineClamped, setLineClamped] = useState(true);

  const [currentCampaigns, setCurrentCampaigns] = useState<
    GetCampaignFunctionResponse[] | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);

  const [sortOption, setSortOption] = useState<
    | "asc-ts"
    | "desc-ts"
    | "asc-up"
    | "desc-up"
    | "asc-rs"
    | "desc-rs"
    | "asc-s"
    | "desc-s"
    | "asc-t"
    | "desc-t"
  >("desc-t");

  const [sortedCampaings, setSortedCampaigns] = useState<
    null | GetCampaignFunctionResponse[]
  >(null);

  const [searchQuery, setSearchQuery] = useState("");

  const { getAllActiveCampaings, isAptosClientReady } = useAptosClient();

  const getInitialCampaings = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const campaings = await getAllActiveCampaings();
    if (!campaings) {
      console.error("Error getting campaigns. See other logs.");
      setIsLoading(false);
      return setCurrentCampaigns(null);
    }

    setIsLoading(false);
    setCurrentCampaigns(campaings);
  };

  useEffect(() => {
    if (!isAptosClientReady) return;
    getInitialCampaings();
  }, [isAptosClientReady]);

  // Managing Sorted Campaings
  useEffect(() => {
    if (!currentCampaigns) return;

    // Manage Search Query First

    let sorted = [...currentCampaigns];

    if (searchQuery) {
      sorted = currentCampaigns.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case "asc-ts":
        sorted.sort((a, b) => a.reward_pool - b.reward_pool);
        break;
      case "desc-ts":
        sorted.sort((a, b) => b.reward_pool - a.reward_pool);
        break;
      case "asc-up":
        sorted.sort((a, b) => a.unit_price - b.unit_price);
        break;
      case "desc-up":
        sorted.sort((a, b) => b.unit_price - a.unit_price);
        break;
      case "asc-rs":
        sorted.sort((a, b) => a.remaining_reward - b.remaining_reward);
        break;
      case "desc-rs":
        sorted.sort((a, b) => b.remaining_reward - a.remaining_reward);
        break;
      case "asc-s":
        sorted.sort((a, b) => a.minimumScore - b.minimumScore);
        break;
      case "desc-s":
        sorted.sort((a, b) => b.minimumScore - a.minimumScore);
        break;
      case "asc-t":
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "desc-t":
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    setSortedCampaigns(sorted);
  }, [sortOption, currentCampaigns, searchQuery]);

  return (
    <div id="active-campaigns-root" className="flex flex-col gap-10">
      <div id="title-description" className="flex flex-col gap-2">
        <div id="title" className=" text-2xl font-bold">
          Data Marketplace
        </div>
        <div
          id="description"
          className="text-gray-400 text-sm"
          onClick={() => setLineClamped(!lineClamped)}
          style={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: lineClamped ? 3 : undefined,
          }}
        >
          The Data Marketplace is a decentralized platform for buying and
          selling data securely and transparently. It enables users to monetize
          their data and access valuable datasets without intermediaries. Users
          can launch campaigns to request specific data, while others submit
          datasets for payment. Powered by the Movement protocol, it ensures
          secure, verifiable transactions through blockchain technology. Whether
          for revenue generation or data-driven decision-making, the Data
          Marketplace offers a scalable solution for diverse business needs.
        </div>
      </div>

      <div
        id="sorting-bar"
        className="flex flex-wrap md:flex-nowrap w-full gap-2 md:gap-8 items-center px-2 md:px-0 md:border-b border-primary/20"
      >
        {/**
         * By Price
         */}
        <Dropdown>
          <DropdownTrigger>
            <div
              id="trigger"
              className="flex flex-row gap-2 text-white font-bold justify-center items-center py-5 cursor-pointer"
            >
              <div>By Price</div>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={[sortOption]}>
            <DropdownItem onPress={() => setSortOption("asc-ts")} key="asc-ts">
              Ascending Total Stake
            </DropdownItem>
            <DropdownItem
              key="desc-ts"
              onPress={() => setSortOption("desc-ts")}
            >
              Descending Total Stake
            </DropdownItem>
            <DropdownItem key="asc-up" onPress={() => setSortOption("asc-up")}>
              Ascending Unit Price
            </DropdownItem>
            <DropdownItem
              key="desc-up"
              onPress={() => setSortOption("desc-up")}
            >
              Descending Unit Price
            </DropdownItem>
            <DropdownItem key="asc-rs" onPress={() => setSortOption("asc-rs")}>
              Ascending Remaining Stake
            </DropdownItem>
            <DropdownItem
              key="desc-rs"
              onPress={() => setSortOption("desc-rs")}
            >
              Descending Remaining Stake
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/**
         * By Properties
         */}
        <Dropdown>
          <DropdownTrigger>
            <div
              id="trigger"
              className="flex flex-row gap-2 text-white font-bold justify-center items-center py-5 cursor-pointer"
            >
              <div>Properties</div>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={[sortOption]}>
            <DropdownItem key="asc-s" onPress={() => setSortOption("asc-s")}>
              Ascending Score
            </DropdownItem>
            <DropdownItem key="desc-s" onPress={() => setSortOption("desc-s")}>
              Descending Score
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/**
         * Sort by
         */}
        <Dropdown>
          <DropdownTrigger>
            <div
              id="trigger"
              className="flex flex-row gap-2 text-white font-bold justify-center items-center py-5 cursor-pointer"
            >
              <div>Sort by</div>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={[sortOption]}>
            <DropdownItem key="desc-t" onPress={() => setSortOption("desc-t")}>
              First News
            </DropdownItem>
            <DropdownItem key="asc-t" onPress={() => setSortOption("asc-t")}>
              First Olds
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/**
         * Search Bar: full width on small screens and auto width on md+
         */}
        <Input
          className="w-full md:w-auto md:ml-auto"
          startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading || sortedCampaings === null ? (
        <div className="flex w-full justify-center items-center h-[50vh]">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-row flex-wrap p-4 md:p-0 gap-5">
          {sortedCampaings.map((campaign) => (
            <CampaignCard
              id={campaign.id}
              staked={campaign.reward_pool}
              unitPrice={campaign.unit_price}
              title={campaign.title}
              campaigner={campaign.creator}
              remainingStakes={campaign.remaining_reward}
              description={campaign.description}
              key={campaign.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
