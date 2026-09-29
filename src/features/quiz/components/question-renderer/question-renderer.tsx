import { SingleChoiceQuestion } from "./single-choice-question";
import type { QuestionRendererProps } from "./question-renderer.types";

export function QuestionRenderer(props: QuestionRendererProps) {
  switch (props.question.type) {
    case "SINGLE_CHOICE":
      return <SingleChoiceQuestion {...props} question={props.question} />;
  }
}
