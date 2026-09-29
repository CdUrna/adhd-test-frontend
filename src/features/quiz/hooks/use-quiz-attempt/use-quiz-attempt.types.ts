import type { QuizQuestion } from "../../quiz.types";

export type QuizAttemptController = {
  question: QuizQuestion;
  questionIndex: number;
  questionCount: number;
  selectedAnswer?: string;
  progress: number;
  isCompleting: boolean;
  error: string | null;
  selectAnswer: (value: string) => void;
  goBack: () => void;
  goForward: () => Promise<void>;
};
