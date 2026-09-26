export type Gender = "MALE" | "FEMALE";

export type QuizOption = {
  value: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  key: string;
  type: "SINGLE_CHOICE";
  title: string;
  position: number;
  options: QuizOption[];
};

export type CurrentQuiz = {
  id: string;
  version: number;
  questions: QuizQuestion[];
};

export type CompleteAttemptInput = {
  quizVersionId: string;
  gender: Gender;
  answers: Array<{
    questionId: string;
    value: string;
  }>;
};

export type AnonymousAttemptResponse = {
  attemptId: string;
  claimToken: string;
  claimTokenExpiresAt: string;
  nextStep: "AUTH_REQUIRED";
};

export type AuthenticatedAttemptResponse = {
  attemptId: string;
  nextStep: "REPORT_READY";
};

export type CompleteAttemptResponse =
  | AnonymousAttemptResponse
  | AuthenticatedAttemptResponse;
