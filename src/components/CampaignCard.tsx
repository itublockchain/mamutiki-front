import { CampaignSector } from "@/types/Campaign";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  priceOffer: number;
  sector: CampaignSector;
  id: string;
};

export function CampaignCard({ title, priceOffer, sector, id }: Props) {
  return (
    <Link href={`/campaigns/${id}`}>
      <Card className="py-4" isPressable>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{sector}</p>
          <small className="text-default-500">${priceOffer} USDT</small>
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={`/sectorImages/${sector}.png`}
          />
        </CardBody>
      </Card>
    </Link>
  );
}
