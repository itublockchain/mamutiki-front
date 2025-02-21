import { Spinner } from "@heroui/react";
import React from "react";

export function GettingAuthStatusPage() {
  return (
    <div className="flex w-full h-screen justify-center items-center ">
      <Spinner size="lg" color="primary" />
    </div>
  );
}
