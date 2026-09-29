"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { completeAttempt } from "../../quiz.api";
import {
  clearQuizDraft,
  readQuizDraft,
  writeQuizDraft,
  type Answers,
} from "../../quiz-draft.storage";
import type { CurrentQuiz, Gender } from "../../quiz.types";
import type { QuizAttemptController } from "./use-quiz-attempt.types";

const AUTO_ADVANCE_DELAY_MS = 250;
const PENDING_ATTEMPT_KEY = "adhd-anonymous-attempt";

export function useQuizAttempt(quiz: CurrentQuiz): QuizAttemptController {
  const router = useRouter();
  const genderRef = useRef<Gender | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let active = true;
    const draft = readQuizDraft();

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
    writeQuizDraft(
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
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [quiz.id, router]);

  function selectAnswer(value: string): void {
    const gender = genderRef.current;
    const question = quiz.questions[questionIndex];
    if (!gender || !question) return;

    idempotencyKeyRef.current = null;
    setAnswers((current) => {
      const updated = { ...current, [question.id]: value };
      writeQuizDraft(gender, quiz.id, updated);
      return updated;
    });
    setError(null);

    if (questionIndex < quiz.questions.length - 1) {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        setQuestionIndex((current) =>
          current === questionIndex ? current + 1 : current,
        );
      }, AUTO_ADVANCE_DELAY_MS);
    }
  }

  function goBack(): void {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setQuestionIndex((current) => Math.max(0, current - 1));
  }

  async function goForward(): Promise<void> {
    const gender = genderRef.current;
    if (!gender) return;

    if (questionIndex < quiz.questions.length - 1) {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsCompleting(true);
    setError(null);
    try {
      const idempotencyKey =
        idempotencyKeyRef.current ?? window.crypto.randomUUID();
      idempotencyKeyRef.current = idempotencyKey;
      writeQuizDraft(gender, quiz.id, answers, idempotencyKey);
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

      clearQuizDraft();
      if (completion.nextStep === "REPORT_READY") {
        window.sessionStorage.removeItem(PENDING_ATTEMPT_KEY);
        router.replace("/report");
      } else {
        window.sessionStorage.setItem(
          PENDING_ATTEMPT_KEY,
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
  return {
    question,
    questionIndex,
    questionCount: quiz.questions.length,
    selectedAnswer: answers[question.id],
    progress: ((questionIndex + 1) / quiz.questions.length) * 100,
    isCompleting,
    error,
    selectAnswer,
    goBack,
    goForward,
  };
}
