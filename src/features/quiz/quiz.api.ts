import type {
  CompleteAttemptInput,
  CompleteAttemptResponse,
  CurrentQuiz,
} from "./quiz.types";
import { getApiUrl } from "@/lib/api-url";
import { toApiError } from "@/lib/api-error";

export async function getCurrentQuiz(signal?: AbortSignal): Promise<CurrentQuiz> {
  const response = await fetch(`${getApiUrl()}/quiz/current`, {
    cache: "no-store",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw await toApiError(
      response,
      "The quiz is temporarily unavailable. Please try again.",
    );
  }

  return (await response.json()) as CurrentQuiz;
}

export async function completeAttempt(
  input: CompleteAttemptInput,
  idempotencyKey: string,
): Promise<CompleteAttemptResponse> {
  const response = await fetch(`${getApiUrl()}/attempts/complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await toApiError(
      response,
      "We could not save your answers. Please try again.",
    );
  }

  return (await response.json()) as CompleteAttemptResponse;
}
