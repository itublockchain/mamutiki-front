import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import Link from "next/link";

type Props = {
  title: string;
  unitPrice: number;
  staked: number;
  id: number;
};

export function CampaignCard({ title, unitPrice, staked, id }: Props) {
  return (
    <Link href={`/campaigns/${id}`}>
      <Card className="py-4" isPressable>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <small className="text-default-500">
            ${unitPrice} USDT - {staked} TOTAL
          </small>
          <h4 className="font-bold text-large text-default">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={`https://picsum.photos/400?random=${id}`}
          />
        </CardBody>
      </Card>
    </Link>
  );
}
