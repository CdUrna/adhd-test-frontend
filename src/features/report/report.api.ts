import type { CurrentReport } from "./report.types";
import { getApiUrl } from "@/lib/api-url";

export async function getCurrentReport(): Promise<CurrentReport> {
  const response = await fetch(`${getApiUrl()}/reports/current`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : "Your report could not be loaded. Please try again.",
    );
  }

  return (await response.json()) as CurrentReport;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${getApiUrl()}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Sign out failed. Please try again.");
  }
}
