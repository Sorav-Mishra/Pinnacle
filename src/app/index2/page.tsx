// components/ClientOnlySSC.tsx
"use client";

import SSCIndex from "../components/SSCIndex";

// import dynamic from "next/dynamic";
// import { Suspense } from "react";

// // ✅ Correct: Only import dynamically
// const SSCIndex = dynamic(() => import("../components/SSCIndex"), {
//   ssr: false,
// });

// export default function ClientOnlySSC() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SSCIndex />
//     </Suspense>
//   );
// }

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSCIndex />
    </Suspense>
  );
}
