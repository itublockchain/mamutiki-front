import SmallScreenStep from "../Roadmap/SmallScreenStep";

export default function RoadmapPart() {
  return (
    <div
      id="roadmap-part"
      className="flex flex-col items-center p-5  md:p-10 bg-black/60 md:min-h-screen gap-10 md:gap-5"
    >
      <div
        id="title"
        className="flex justify-center items-center font-bold text-3xl md:text-4xl text-white"
      >
        ROADMAP
      </div>

      <div
        id="vertical-line-1"
        className="hidden md:flex h-8 w-0 border border-white"
      />

      <div
        id="q1-part"
        className="hidden md:flex flex-col w-[64%] items-center gap-5"
      >
        <div id="title-part" className="text-primary text-4xl">
          Q1
        </div>

        <div id="q1-content" className="flex flex-row gap-4">
          <div
            id="content-title"
            className="flex items-center justify-end w-[49%]"
          >
            <div
              id="text-part"
              className="flex w-full self-start justify-end text-2xl p-2 border-b border-primary/50 "
            >
              $Data Token
            </div>
          </div>

          <div
            id="content-divider-vertical-line-part"
            className="flex w-[2%] justify-center items-center"
          >
            <div
              id="content-divider-vertical-line"
              className="flex w-0 h-full border border-white"
            />
          </div>

          <div
            id="content-paragraph-part"
            className="flex w-[49%] border border-l-0 border-primary/40 rounded-md rounded-l-none text-sm text-white p-5 pl-2"
          >
            We will create and integrate our own token $DATA to enhance the
            functionality and ecosystem of our project. This token will be
            utilized for transactions, rewards, and various platform
            interactions, providing additional value to our users.
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q1"
        stepTitle="$Data Token"
        stepDescription=" We will create and integrate our own token $DATA to enhance the
            functionality and ecosystem of our project. This token will be
            utilized for transactions, rewards, and various platform
            interactions, providing additional value to our users."
      />

      <div
        id="q2-part"
        className="hidden md:flex flex-col w-[64%] items-center gap-5"
      >
        <div id="title-part" className="text-primary text-4xl">
          Q2
        </div>
        <div id="q2-content" className="flex flex-row gap-4">
          <div
            id="content-paragraph-part"
            className="flex w-[49%] border border-l-0 border-primary/40 rounded-md rounded-l-none text-sm text-white p-5 pr-2 text-right"
          >
            We will create and integrate our own token $DATA to enhance the
            functionality and ecosystem of our project. This token will be
            utilized for transactions, rewards, and various platform
            interactions, providing additional value to our users.
          </div>

          <div
            id="content-divider-vertical-line-part"
            className="flex w-[2%] justify-center items-center"
          >
            <div
              id="content-divider-vertical-line"
              className="flex w-0 h-full border border-white"
            />
          </div>

          <div
            id="content-title"
            className="flex items-center justify-end w-[49%]"
          >
            <div
              id="text-part"
              className="flex w-full self-start justify-start text-2xl p-2 border-b border-primary/50 "
            >
              Launch DApp
            </div>
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q2"
        stepTitle="Launch DApp"
        stepDescription="We will create and integrate our own token $DATA to enhance the
            functionality and ecosystem of our project. This token will be
            utilized for transactions, rewards, and various platform
            interactions, providing additional value to our users."
      />

      <div
        id="q3-part"
        className="hidden md:flex flex-col w-[64%] items-center gap-5"
      >
        <div id="title-part" className="text-primary text-4xl">
          Q3
        </div>

        <div id="q3-content" className="flex flex-row gap-4">
          <div
            id="content-title"
            className="flex items-center justify-end w-[49%]"
          >
            <div
              id="text-part"
              className="flex w-full self-start justify-end text-2xl p-2 border-b border-primary/50 "
            >
              Onboarding
            </div>
          </div>

          <div
            id="content-divider-vertical-line-part"
            className="flex w-[2%] justify-center items-center"
          >
            <div
              id="content-divider-vertical-line"
              className="flex w-0 h-full border border-white"
            />
          </div>

          <div
            id="content-paragraph-part"
            className="flex w-[49%] border border-l-0 border-primary/40 rounded-md rounded-l-none text-sm text-white p-5 pl-2"
          >
            We will onboard our first customers, allowing them to experience our
            data marketplace firsthand. Their feedback will help us refine the
            platform and improve its features to better meet user needs.
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q3"
        stepTitle="Onboarding"
        stepDescription="We will onboard our first customers, allowing them to experience our
            data marketplace firsthand. Their feedback will help us refine the
            platform and improve its features to better meet user needs."
      />

      <div
        id="ending-vertical-lines"
        className="hidden md:flex flex-col gap-3 "
      >
        <div id="vertical-line-2" className="h-8 w-0 border border-white" />
        <div id="vertical-line-3" className="h-4 w-0 border border-white" />
        <div id="vertical-line-3" className="h-2 w-0 border border-white" />
      </div>
    </div>
  );
}
