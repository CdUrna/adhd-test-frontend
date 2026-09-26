"use client";

import { useRouter } from "next/navigation";
import { ReportView } from "../report-view";

export function ReportPageView() {
  const router = useRouter();

  return (
    <ReportView
      onRetake={() => router.push("/?retake=1")}
      onSignedOut={() => router.replace("/")}
    />
  );
}
