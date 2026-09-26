import type { AnonymousAttemptResponse } from "../../quiz/quiz.types";

export function readPendingAttempt(): AnonymousAttemptResponse | null {
  try {
    const raw = window.sessionStorage.getItem("adhd-anonymous-attempt");
    if (!raw) return null;
    const attempt = JSON.parse(raw) as Partial<AnonymousAttemptResponse>;
    return attempt.nextStep === "AUTH_REQUIRED" && typeof attempt.claimToken === "string"
      ? (attempt as AnonymousAttemptResponse)
      : null;
  } catch {
    return null;
  }
}
