import { Input } from "@heroui/react";
import React from "react";

export default function Footer() {
  return (
    <div
      id="rooter"
      className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between px-20 py-10"
    >
      <img src="/logo.png" className="w-32 h-32" />

      <div id="resources-part" className="flex flex-col gap-2">
        <div id="title" className="text-white text-lg font-bold">
          Resources
        </div>
        <div id="links" className="flex flex-col gap-1 text-white text-sm">
          <a href="/about">Leaderboard</a>
          <a href="/terms">Mamut</a>
          <a href="/contact">Blog</a>
          <a href="/privacy" className="text-primary">
            Contact Us
          </a>
        </div>
      </div>

      <div id="social-part" className="flex flex-col gap-2">
        <div id="title" className="text-white text-lg font-bold">
          Social
        </div>
        <div id="links" className="flex flex-col gap-2 text-white text-sm">
          <a
            href="https://x.com"
            id="x-link"
            className="flex flex-row items-center gap-2"
          >
            <img src="/x.png" className="w-5 h-5" />
            <div>Mamutiki</div>
          </a>

          <a
            href="https://telegram.org"
            id="telegram-link"
            className="flex flex-row gap-2 items-center"
          >
            <img src="/telegram.png" className="w-5 h-5" />
            <div>Mamutiki</div>
          </a>

          <a
            href="https://discord.com"
            id="discord-link"
            className="flex flex-row gap-2 items-center"
          >
            <img src="/discord_logo.png" className="w-5" />
            <div>Mamutiki</div>
          </a>
        </div>
      </div>

      <div id="stay-in-touch" className="flex flex-col gap-2 mt-5 md:mt-0">
        <div id="label" className="font-bold">
          Stay in touch
        </div>
        <Input
          endContent={
            <div
              id="submit-button"
              className="flex justify-center cursor-pointer items-center text-sm bg-primary text-black rounded-lg py-1.5 px-6 transition transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              Subscribe
            </div>
          }
        />
      </div>
    </div>
  );
}
