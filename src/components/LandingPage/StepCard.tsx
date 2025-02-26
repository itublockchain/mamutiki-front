import React from "react";

type Props = {
  title: string;
  description: string;
  iconURL: string;
  imageURL: string;
  className?: string;
};

export default function StepCard({
  title,
  description,
  iconURL,
  imageURL,
  className,
}: Props) {
  return (
    <div
      id="step-card-root"
      className={`flex flex-col w-[300px] gap-2 p-5 bg-transparent ${className}`}
    >
      <div
        id="icon-title-part"
        className="flex border-b border-primary/30 flex-row items-center gap-2"
      >
        <div className="flex text-xl font-bold text-white ">{title}</div>
        <div id="img-part" className="flex">
          <img src={iconURL} alt="icon" className="h-5 w-5" />
        </div>
      </div>

      <div className="text-base text-gray-200 mt-2">{description}</div>

      <div id="image-part" className="flex justify-center">
        <img src={imageURL} alt="image" className="w-full h-auto" />
      </div>
    </div>
  );
}
