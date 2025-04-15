import React, { Suspense } from "react";
import SSCIndex from "../components/SSCIndex";

export default function Index2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSCIndex />
    </Suspense>
  );
}
