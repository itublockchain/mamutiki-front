import React, { useEffect, useRef } from "react";

//@ts-expect-error - Vanta.js is not typed
import HALO from "vanta/dist/vanta.halo.min";
import * as THREE from "three";

export default function VantaBackground() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = HALO({
      el: vantaRef.current,
      THREE,
      backgroundColor: 0x0,
      baseColor: 0xfdcc00,
      amplitudeFactor: 2,
      size: 1,
      xOffset: 0.25,
      yOffset: 0.25,
    });

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <>
      <div
        className="flex absolute inset-0 w-full h-screen"
        ref={vantaRef}
      ></div>
    </>
  );
}
