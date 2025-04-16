"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const SSCIndex = dynamic(() => import("../components/SSCIndex"), {
  ssr: false,
});

export default function Index2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSCIndex />
    </Suspense>
  );
}
