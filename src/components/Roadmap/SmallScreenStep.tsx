import React from "react";

type Props = {
  quarterTitle: string;
  stepTitle: string;
  stepDescription: string;
};

export default function SmallScreenStep({
  quarterTitle,
  stepTitle,
  stepDescription,
}: Props) {
  return (
    <div id="root" className="flex md:hidden w-full flex-col gap-5">
      <div
        id="step-quarter-title"
        className="flex font-bold w-[20%] text-primary justify-center text-4xl"
      >
        {quarterTitle}
      </div>

      <div id="divider-content-parts" className="flex w-full flex-row gap-5">
        <div
          id="divider-parent"
          className="flex w-full justify-center"
        >
          <div id="divider" className="flex w-0 border" />
        </div>
        <div
          id="title-description-parts"
          className="flex flex-col gap-1.5 -translate-x-[13%] pb-7"
        >
          <div id="step-title" className="flex text-2xl text-white">
            {stepTitle}
          </div>

          <div
            id="step-description"
            className="flex text-sm text-white p-4 pl-0 border border-l-0 border-primary/30 rounded-md rounded-l-none"
          >
            {stepDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
