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
            className="relative flex flex-col gap-2 w-[49%] "
          >
            <div id="upper-part" className="flex h-[50%] items-end justify-end">
              <div id="text-part" className="flex text-2xl">
                Laying the Groundwork
              </div>
            </div>

            <div
              id="down-part"
              className="flex h-[50%]"
              style={{
                borderTop: "1px solid transparent",

                borderImageSource:
                  "linear-gradient(to right, #fff540, transparent)",
                borderImageSlice: 1,
              }}
            />
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
            Integrating Trusted Execution Environments (TEE) to ensure privacy
            and efficiency from the ground up. And embedding Gitcoin Passport to
            create a secure and trusted user base.
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q1"
        stepTitle="Laying the Groundwork"
        stepDescription="Integrating Trusted Execution Environments (TEE) to ensure privacy and efficiency from the ground up. And embedding Gitcoin Passport to create a secure and trusted user base."
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
            className="flex w-[49%] border border-r-0 border-primary/40 rounded-md rounded-r-none text-sm text-white p-5 pr-2 text-right"
          >
            Completing and testing Gitcoin Passport integration for maximum
            reliability. And developing a custom trusted wallet verifier node
            for being more decenterlized platform
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
            className="relative flex flex-col gap-2 w-[49%] "
          >
            <div
              id="upper-part"
              className="flex h-[50%] items-end justify-start"
            >
              <div id="text-part" className="flex text-2xl">
                Strengthening the Core
              </div>
            </div>

            <div
              id="down-part"
              className="flex h-[50%]"
              style={{
                borderTop: "1px solid transparent",

                borderImageSource:
                  "linear-gradient(to left, #fff540, transparent)",
                borderImageSlice: 1,
              }}
            />
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q2"
        stepTitle="Strengthening the Core"
        stepDescription="Completing and testing Gitcoin Passport integration for maximum reliability. And developing a custom trusted wallet verifier node for being more decenterlized platform."
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
            className="relative flex flex-col gap-2 w-[49%] "
          >
            <div id="upper-part" className="flex h-[50%] items-end justify-end">
              <div id="text-part" className="flex text-2xl">
                Mainnet Ignition
              </div>
            </div>

            <div
              id="down-part"
              className="flex h-[50%]"
              style={{
                borderTop: "1px solid transparent",

                borderImageSource:
                  "linear-gradient(to right, #fff540, transparent)",
                borderImageSlice: 1,
              }}
            />
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
            Launching the mainnet—full decentralization goes live, marking the
            ecosystem&apos;s big debut. And rolling out the XP-based Panathenaia
            campaign, engaging the community and rewarding early adopters as
            momentum builds.
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q3"
        stepTitle="Mainnet Ignition"
        stepDescription="Launching the mainnet—full decentralization goes live, marking the ecosystems big debut. And rolling out the XP-based Panathenaia campaign, engaging the community and rewarding early adopters as momentum builds."
      />

      <div
        id="q4-part"
        className="hidden md:flex flex-col w-[64%] items-center gap-5"
      >
        <div id="title-part" className="text-primary text-4xl">
          Q4
        </div>
        <div id="q4-content" className="flex flex-row gap-4">
          <div
            id="content-paragraph-part"
            className="flex w-[49%] border border-r-0 border-primary/40 rounded-md rounded-r-none text-sm text-white p-5 pr-2 text-right"
          >
            Introducing exclusive tools and features, providing premium value
            and driving adoption. And launching community voting for burn and
            buyback strategies, ensuring long-term sustainability and user
            empowerment.
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
            className="relative flex flex-col gap-2 w-[49%] "
          >
            <div
              id="upper-part"
              className="flex h-[50%] items-end justify-start"
            >
              <div id="text-part" className="flex text-2xl">
                Scaling New Heights
              </div>
            </div>

            <div
              id="down-part"
              className="flex h-[50%]"
              style={{
                borderTop: "1px solid transparent",

                borderImageSource:
                  "linear-gradient(to left, #fff540, transparent)",
                borderImageSlice: 1,
              }}
            />
          </div>
        </div>
      </div>

      <SmallScreenStep
        quarterTitle="Q4"
        stepTitle="Scaling New Heights"
        stepDescription="Introducing exclusive tools and features, providing premium value and driving adoption. And launching community voting for burn and buyback strategies, ensuring long-term sustainability and user empowerment."
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
