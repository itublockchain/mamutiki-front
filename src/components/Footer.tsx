import { Input } from "@heroui/react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div
      id="footer-root"
      className="flex flex-row flex-wrap gap-10 px-20 py-10 justify-between items-center"
    >
      <div id="logo-part" className="flex justify-center items-center">
        <img src="/logo.png" alt="logo" className="w-24 h-28 " />
      </div>

      <div
        id="resources-social-part"
        className="flex flex-row gap-32 text-gray-500 text-sm"
      >
        <div id="resources-part" className="flex flex-col gap-2 border-red-500">
          <div id="label">Resources</div>
          <div id="contents" className="flex flex-col gap-2">
            <Link href="/">Leaderboard</Link>
            <Link href="/">MAMUT</Link>
            <Link href="/">Blog</Link>
            <Link href="/" className="text-primary">
              Contact us
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

            <Link
              href="/"
              id="telegram-part"
              className="flex flex-row gap-3 items-center justify-center"
            >
              <div id="icon-part" className="flex">
                <img src="/telegram.png" alt="telegram" className="w-3 h-3" />
              </div>
              <div id="label">@datagoraxyz</div>
            </Link>

            <Link
              id="discord-part"
              className="flex flex-row gap-3 items-center justify-center"
              href="/"
            >
              <div id="icon-part" className="flex">
                <img src="/discord.png" alt="discord" className="w-3 h-3" />
              </div>
              <div id="label">@datagoraxyz</div>
            </Link>
          </div>
        </div>
      </div>

      <div
        id="stay-in-touch-button"
        className="flex flex-col gap-2 p-4 bg-white/10 rounded-xl"
      >
        <div id="label" className="text-white font-bold text-sm">
          Stay in touch
        </div>

        <div id="input-and-button-part" className="flex flex-row gap-2">
          <div id="input-part" className="flex items-center">
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
      </div>
    </div>
  );
}
