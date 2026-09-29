import type { SingleChoiceQuestion } from "../../quiz.types";
import styles from "./question-renderer.module.css";

type SingleChoiceQuestionProps = {
  question: SingleChoiceQuestion;
  selectedValue?: string;
  onSelect: (value: string) => void;
};

export function SingleChoiceQuestion({
  question,
  selectedValue,
  onSelect,
}: SingleChoiceQuestionProps) {
  return (
    <div className={styles.answerList} role="radiogroup" aria-label="Answer options">
      {question.options.map((option) => {
        const selected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`${styles.answerOption} ${selected ? styles.selected : ""}`}
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
