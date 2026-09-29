import type { AuthInput, AuthMode, AuthResponse } from "./auth.types";
import { getApiUrl } from "@/lib/api-url";
import { toApiError } from "@/lib/api-error";

export async function authenticate(
  mode: AuthMode,
  input: AuthInput,
): Promise<AuthResponse> {
  const response = await fetch(`${getApiUrl()}/auth/${mode}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await toApiError(
      response,
      "Authentication failed. Please try again.",
    );
  }

  return (await response.json()) as AuthResponse;
}

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  const response = await fetch(`${getApiUrl()}/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Session check failed");
  }

  return (await response.json()) as AuthResponse["user"];
}
