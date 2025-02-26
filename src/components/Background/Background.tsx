import React from "react";

export default function Background() {
  return (
    <div
      id="bg-root"
      className="absolute flex flex-row gap-10 pt-[50vh] h-[400vh] w-screen z-0 overflow-hidden"
    >
      <div id="shape-1" className="flex w-[30%] opacity-25">
        <img src="/bg/shape1.png" className="w-full " alt="shape-1" />
      </div>
      <div id="shape-2" className="flex w-[25%] opacity-50">
        <img src="/bg/shape2.png" className="w-full" alt="shape-2" />
      </div>
      <div id="shape-3" className="flex w-[25%] opacity-50">
        <img src="/bg/shape3.png" className="w-full" alt="shape-3" />
      </div>
      <div id="shape-4" className="flex w-[30%] opacity-10">
        <img src="/bg/shape4.png" className="w-full" alt="shape-4" />
      </div>
    </div>
  );
}
