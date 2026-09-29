"use client";

import { AppHeader } from "@/components/app-header";
import { PageShell } from "@/components/page-shell";
import { useQuizAttempt } from "../../hooks/use-quiz-attempt/use-quiz-attempt";
import { QuestionRenderer } from "../question-renderer";
import styles from "./test-view.module.css";
import type { TestViewProps } from "./test-view.types";

export function TestView({ initialQuiz: quiz }: TestViewProps) {
  const attempt = useQuizAttempt(quiz);

  return (
    <PageShell layout="column">
      <AppHeader />
      <section className={styles.questionPanel} aria-labelledby="question-title">
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${attempt.progress}%` }} />
        </div>
        <h1 id="question-title">{attempt.question.title}</h1>
        <QuestionRenderer
          question={attempt.question}
          selectedValue={attempt.selectedAnswer}
          onSelect={attempt.selectAnswer}
        />
        <div className={styles.questionNavigation}>
          <button
            type="button"
            className={styles.navigationButton}
            aria-label="Previous question"
            disabled={attempt.questionIndex === 0}
            onClick={attempt.goBack}
          >
            ←
          </button>
          <span>{attempt.questionIndex + 1}/{attempt.questionCount}</span>
          <button
            type="button"
            className={styles.navigationButton}
            aria-label={attempt.questionIndex === attempt.questionCount - 1 ? "Finish test" : "Next question"}
            disabled={!attempt.selectedAnswer || attempt.isCompleting}
            onClick={() => void attempt.goForward()}
          >
            →
          </button>
        </div>
        {attempt.isCompleting ? <p className={styles.completionStatus}>Saving your answers…</p> : null}
        {attempt.error ? <p className={styles.completionError} role="alert">{attempt.error}</p> : null}
      </section>
    </PageShell>
  );
}
