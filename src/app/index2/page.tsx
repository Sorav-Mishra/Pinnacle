"use client";

import SSCIndex from "../components/SSCIndex";

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSCIndex />
    </Suspense>
  );
}
