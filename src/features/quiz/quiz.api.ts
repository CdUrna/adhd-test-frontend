import type {
  CompleteAttemptInput,
  CompleteAttemptResponse,
  CurrentQuiz,
} from "./quiz.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function getCurrentQuiz(signal?: AbortSignal): Promise<CurrentQuiz> {
  const response = await fetch(`${apiUrl}/quiz/current`, {
    cache: "no-store",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("The quiz is temporarily unavailable. Please try again.");
  }

  return (await response.json()) as CurrentQuiz;
}

export async function completeAttempt(
  input: CompleteAttemptInput,
  idempotencyKey: string,
): Promise<CompleteAttemptResponse> {
  const response = await fetch(`${apiUrl}/attempts/complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("We could not save your answers. Please try again.");
  }

  return (await response.json()) as CompleteAttemptResponse;
}
