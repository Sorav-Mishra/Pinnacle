// components/ClientOnlySSC.tsx
"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ Correct: Only import dynamically
const SSCIndex = dynamic(() => import("../components/SSCIndex"), {
  ssr: false,
});

export default function ClientOnlySSC() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSCIndex />
    </Suspense>
  );
}
