import type { CurrentReport } from "./report.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function getCurrentReport(): Promise<CurrentReport> {
  const response = await fetch(`${apiUrl}/reports/current`, {
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
  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Sign out failed. Please try again.");
  }
}
