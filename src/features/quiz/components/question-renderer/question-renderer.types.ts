import type { QuizQuestion } from "../../quiz.types";

export type QuestionRendererProps = {
  question: QuizQuestion;
  selectedValue?: string;
  onSelect: (value: string) => void;
};
