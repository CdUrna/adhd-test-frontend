import type { Gender } from "./quiz.types";

const QUIZ_DRAFT_KEY = "adhd-quiz-draft";

export type Answers = Record<string, string>;

export type QuizDraft = {
  gender?: Gender;
  quizVersionId?: string;
  answers?: Answers;
  completionIdempotencyKey?: string;
};

export function readQuizDraft(): QuizDraft | null {
  try {
    const raw = window.localStorage.getItem(QUIZ_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as QuizDraft;
    return draft.gender === "MALE" || draft.gender === "FEMALE" ? draft : null;
  } catch {
    return null;
  }
}

export function writeQuizDraft(
  gender: Gender,
  quizVersionId: string,
  answers: Answers,
  completionIdempotencyKey?: string,
): void {
  window.localStorage.setItem(
    QUIZ_DRAFT_KEY,
    JSON.stringify({
      gender,
      quizVersionId,
      answers,
      completionIdempotencyKey,
    }),
  );
}

export function initializeQuizDraft(gender: Gender): void {
  window.localStorage.setItem(
    QUIZ_DRAFT_KEY,
    JSON.stringify({ gender, answers: {} } satisfies QuizDraft),
  );
}

export function clearQuizDraft(): void {
  window.localStorage.removeItem(QUIZ_DRAFT_KEY);
}
