/* eslint-disable react/prop-types */
import { Suspense } from "react";
import { MatxLoading } from "/src/dashboard/app/components";

export default function MatxSuspense({ children }) {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
}
