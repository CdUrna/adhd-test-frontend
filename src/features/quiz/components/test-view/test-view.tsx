"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { PageShell } from "@/components/page-shell";
import { completeAttempt } from "../../quiz.api";
import styles from "./test-view.module.css";
import type { Answers, StoredDraft, TestViewProps } from "./test-view.types";
import type { Gender } from "../../quiz.types";

export function TestView({ initialQuiz: quiz }: TestViewProps) {
  const router = useRouter();
  const genderRef = useRef<Gender | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let active = true;
    const draft = readDraft();

    if (!draft?.gender) {
      router.replace("/");
      return;
    }

    genderRef.current = draft.gender;
    const restoredAnswers =
      draft.quizVersionId === quiz.id ? (draft.answers ?? {}) : {};
    idempotencyKeyRef.current =
      draft.quizVersionId === quiz.id
        ? (draft.completionIdempotencyKey ?? null)
        : null;

    persistDraft(
      draft.gender,
      quiz.id,
      restoredAnswers,
      idempotencyKeyRef.current ?? undefined,
    );
    void Promise.resolve().then(() => {
      if (active) setAnswers(restoredAnswers);
    });

    return () => {
      active = false;
    };
  }, [quiz.id, router]);

  function selectAnswer(questionId: string, value: string): void {
    const gender = genderRef.current;
    if (!gender || !quiz) return;
    const updatedAnswers = { ...answers, [questionId]: value };
    idempotencyKeyRef.current = null;
    setAnswers(updatedAnswers);
    persistDraft(gender, quiz.id, updatedAnswers);
  }

  async function goForward(): Promise<void> {
    const gender = genderRef.current;
    if (!quiz || !gender) return;

    if (questionIndex < quiz.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsCompleting(true);
    setError(null);
    try {
      const idempotencyKey =
        idempotencyKeyRef.current ?? window.crypto.randomUUID();
      idempotencyKeyRef.current = idempotencyKey;
      persistDraft(gender, quiz.id, answers, idempotencyKey);
      const completion = await completeAttempt(
        {
          quizVersionId: quiz.id,
          gender,
          answers: quiz.questions.map((question) => ({
            questionId: question.id,
            value: answers[question.id],
          })),
        },
        idempotencyKey,
      );

      window.localStorage.removeItem("adhd-quiz-draft");
      if (completion.nextStep === "REPORT_READY") {
        window.sessionStorage.removeItem("adhd-anonymous-attempt");
        router.replace("/report");
      } else {
        window.sessionStorage.setItem(
          "adhd-anonymous-attempt",
          JSON.stringify(completion),
        );
        router.replace("/auth");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not save your answers. Please try again.",
      );
    } finally {
      setIsCompleting(false);
    }
  }

  const question = quiz.questions[questionIndex];
  const selectedAnswer = answers[question.id];
  const progress = ((questionIndex + 1) / quiz.questions.length) * 100;

  return (
    <PageShell layout="column">
      <AppHeader />
      <section className={styles.questionPanel} aria-labelledby="question-title">
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <h1 id="question-title">{question.title}</h1>
        <div className={styles.answerList} role="radiogroup" aria-label="Answer options">
          {question.options.map((option) => {
            const selected = selectedAnswer === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`${styles.answerOption} ${selected ? styles.selected : ""}`}
                role="radio"
                aria-checked={selected}
                onClick={() => selectAnswer(question.id, option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className={styles.questionNavigation}>
          <button
            type="button"
            className={styles.navigationButton}
            aria-label="Previous question"
            disabled={questionIndex === 0}
            onClick={() => setQuestionIndex((current) => current - 1)}
          >
            ←
          </button>
          <span>{questionIndex + 1}/{quiz.questions.length}</span>
          <button
            type="button"
            className={styles.navigationButton}
            aria-label={questionIndex === quiz.questions.length - 1 ? "Finish test" : "Next question"}
            disabled={!selectedAnswer || isCompleting}
            onClick={() => void goForward()}
          >
            →
          </button>
        </div>
        {isCompleting ? <p className={styles.completionStatus}>Saving your answers…</p> : null}
        {error ? <p className={styles.completionError} role="alert">{error}</p> : null}
      </section>
    </PageShell>
  );
}

function readDraft(): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem("adhd-quiz-draft");
    if (!raw) return null;
    const draft = JSON.parse(raw) as StoredDraft;
    return draft.gender === "MALE" || draft.gender === "FEMALE" ? draft : null;
  } catch {
    return null;
  }
}

function persistDraft(
  gender: Gender,
  quizVersionId: string,
  answers: Answers,
  completionIdempotencyKey?: string,
): void {
  window.localStorage.setItem(
    "adhd-quiz-draft",
    JSON.stringify({
      gender,
      quizVersionId,
      answers,
      completionIdempotencyKey,
    }),
  );
}
