import { Input } from "@heroui/react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div
      id="rooter"
      className="flex flex-row justify-between items-center p-10"
    >
      <div id="text" className="text-gray-500 max-w-sm">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
        since the.
        <div className="mt-3 text-gray-400">@2025 - All rights reserved</div>
      </div>

      <div id="resources-part" className="flex flex-col text-gray-500 gap-3">
        <div id="labal" className="mb-2">
          Resources
        </div>

        <Link href="/">Leaderboard</Link>
        <Link href="/">Mamut</Link>
        <Link href="/">Blog</Link>
        <Link href="/" className="text-primary text-sm">
          Contact Us
        </Link>
      </div>

      <div
        id="social-part"
        className="flex flex-col justify-center text-gray-500 gap-3 mb-5"
      >
        <div id="labal" className="mb-2">
          Social
        </div>

        <Link href="/" className="flex flex-row gap-2 items-center ">
          <img src="/x.png" className="w-3 h-3" />X (Twitter)
        </Link>

        <Link href="/" className="flex flex-row gap-2 items-center">
          <img src="/telegram.png" className="w-4" />
          Telegram
        </Link>

        <Link href="/" className="flex flex-row gap-2 items-center">
          <img src="/discord_logo.png" className="w-4" />
          Discord
        </Link>
      </div>

      <div
        id="stay-in-touch"
        className="flex flex-col bg-white/10 rounded-xl font-bold justify-center gap-3 p-3 pb-4"
      >
        Stay in touch
        <div className="flex flex-row  jusitfy-center gap-1.5">
          <Input label="helloworld@xyz.com" className="h-5" />

          <div
            id="subscribe-button"
            className="h-9 p-1 px-3 flex items-center justify-center bg-primary text-black text-sm rounded-lg cursor-pointer"
          >
            Subscribe
          </div>
        </div>
      </div>
    </div>
  );
}
