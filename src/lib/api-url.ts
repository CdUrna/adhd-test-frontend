const localApiUrl = "http://localhost:4000/api/v1";

export function getApiUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? localApiUrl;
  }

  return process.env.NEXT_PUBLIC_API_URL ?? localApiUrl;
}
