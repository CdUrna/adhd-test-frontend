import type { AuthInput, AuthMode, AuthResponse } from "./auth.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function authenticate(
  mode: AuthMode,
  input: AuthInput,
): Promise<AuthResponse> {
  const response = await fetch(`${apiUrl}/auth/${mode}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message[0]
      : errorBody?.message;

    throw new Error(message ?? "Authentication failed. Please try again.");
  }

  return (await response.json()) as AuthResponse;
}

export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  const response = await fetch(`${apiUrl}/auth/me`, {
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
