import React from "react";

import ReactPlayer from "react-player";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-screen pt-[56.25%]">
        <ReactPlayer
          url="https://vimeo.com/1058743491"
          playing
          loop
          muted
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
          
        />
      </div>

      <div id="black-mask" className="absolute inset-0 bg-black/30 z-10" />
    </div>
  );
}
