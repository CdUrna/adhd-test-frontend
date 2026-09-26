import type { CurrentQuiz, Gender } from "../../quiz.types";

export type TestViewProps = {
  initialQuiz: CurrentQuiz;
};

export type Answers = Record<string, string>;

export type StoredDraft = {
  gender?: Gender;
  quizVersionId?: string;
  answers?: Answers;
};
