import { SubmittedDataDocData } from "@/types/SubmitData";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";

type Props = {
  submittedData: SubmittedDataDocData;
};

export function SubmittedDataPreviewCard({ submittedData }: Props) {
  return (
    <Card isPressable isHoverable className=" max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="heroui logo"
          height={40}
          radius="sm"
          src={`https://picsum.photos/200/300?random=${submittedData.creatorId}`}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{submittedData.creatorId}</p>
          <p className="text-small text-default-500">
            {submittedData.creatorId}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div id="quality-part">
          <p className="text-md">Quality: {submittedData.dataQuality}</p>
        </div>
        <div id="length-part">
          <p className="text-md">Data: {submittedData.dataLength}</p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href={`/submittedDatas/${submittedData.id}`}
        >
          Visit
        </Link>
      </CardFooter>
    </Card>
  );
}
