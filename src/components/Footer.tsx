import Link from "next/link";

export default function Footer() {
  return (
    <div
      id="footer-root"
      className="flex flex-row flex-wrap gap-10 md:gap-10 p-10 md:p-0 md:px-20 md:py-10 justify-between items-center"
    >
      <div id="logo-part" className="flex justify-center items-center">
        <img
          src="/logo.png"
          alt="logo"
          className="w-12 h-14 md:w-24 md:h-28 "
        />
      </div>

      <div
        id="resources-social-part"
        className="flex flex-row flex-grow md:flex-grow-0 justify-between md:justify-normal md:gap-32 text-gray-500 text-sm"
      >
        <div id="resources-part" className="flex flex-col gap-2 border-red-500">
          <div id="label">Resources</div>
          <div id="contents" className="flex flex-col gap-2">
            <Link href="https://medium.com/@datagoraxyz" target="_blank">
              Blog
            </Link>
            <Link
              href="https://github.com/itublockchain/mamutiki-back"
              target="_blank"
            >
              Github
            </Link>
            <Link
              href="https://docs.datagora.xyz"
              target="_blank"
              className="text-primary"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div id="social-part" className="flex flex-col gap-2 border-red-500">
          <div id="label">Social</div>
          <div id="contents" className="flex flex-col gap-3">
            <Link
              href="https://twitter.com/datagoraxyz"
              id="x-part"
              className="flex flex-row gap-3 items-center justify-center"
            >
              <div id="icon-part" className="flex">
                <img src="/x.png" alt="x" className="w-3 h-3" />
              </div>
              <div id="label">@datagoraxyz</div>
            </Link>
          </div>
        </div>
      </div>

      <div
        id="mamoothon-part"
        className="flex flex-col justify-center items-center gap-1"
      >
        <div
          id="label"
          className="flex w-full items-center font-bold  text-lg translate-x-5"
        >
          BUILT FOR
        </div>
        <img src="/mammoth.png" className="w-auto h-24" />
      </div>

      {/* <div
        id="stay-in-touch-button"
        className="flex w-full md:w-auto flex-col gap-2 p-4 bg-white/10 rounded-xl"
      >
        <div id="label" className="text-white font-bold text-sm">
          Stay in touch
        </div>

        <div id="input-and-button-part" className="flex flex-row gap-2">
          <div
            id="input-part"
            className="flex flex-grow md:flex-grow-0 items-center"
          >
            <Input size="sm" placeholder={"abc@def.com"} />
          </div>
          <div id="button-part" className="flex items-center">
            <Link
              id="button"
              className="flex items-start justify-center text-black py-1 px-2 bg-primary rounded-md text-sm cursor-pointer"
              href="/"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}
