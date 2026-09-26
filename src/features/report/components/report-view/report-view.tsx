"use client";

import { useEffect, useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/button";
import { LoadingScreen } from "@/components/loading-screen";
import { PageShell } from "@/components/page-shell";
import { SurfaceCard } from "@/components/surface-card";
import { getCurrentReport, logout } from "../../report.api";
import { CognitiveStrengthsSection } from "../cognitive-strengths-section";
import { EmotionalRegulationSection } from "../emotional-regulation-section";
import { FaqSection } from "../faq-section";
import { ScoreGauge } from "../score-gauge";
import { UnderstandingScoreSection } from "../understanding-score-section";
import styles from "./report-view.module.css";
import type { ReportViewProps } from "./report-view.types";
import type { CurrentReport } from "../../report.types";

export function ReportView({ onRetake, onSignedOut }: ReportViewProps) {
  const [report, setReport] = useState<CurrentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    void getCurrentReport()
      .then((currentReport) => {
        if (active) {
          setReport(currentReport);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Your report could not be loaded.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function signOut(): Promise<void> {
    setIsSigningOut(true);
    setError(null);

    try {
      await logout();
      onSignedOut();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Sign out failed. Please try again.",
      );
      setIsSigningOut(false);
    }
  }

  if (error && !report) {
    return (
      <PageShell>
        <SurfaceCard className={styles.card} role="alert">
          <h1>We could not open your report</h1>
          <p>{error}</p>
          <Button type="button" className={styles.primaryAction} onClick={onSignedOut}>
            Return to start
          </Button>
        </SurfaceCard>
      </PageShell>
    );
  }

  if (!report) {
    return (
      <LoadingScreen aria-live="polite">
        Loading your personal report…
      </LoadingScreen>
    );
  }

  const resultLabel =
    report.resultType === "HIGH_ADHD_TRAITS" ? "High ADHD Traits" : "Low ADHD Traits";
  const scoreExplanation = report.sections.find((section) => section.key === "understanding-score");
  const cognitiveStrengths = report.sections.find((section) => section.key === "cognitive-strengths");
  const emotionalRegulation = report.sections.find(
    (section) => section.key === "emotional-regulation",
  );

  return (
    <main className={styles.page}>
      <AppHeader
        className={styles.header}
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className={styles.retakeButton}
              onClick={onRetake}
            >
              Retake test
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isSigningOut}
              onClick={() => void signOut()}
            >
              {isSigningOut ? "Signing out…" : "Sign out"}
            </Button>
          </>
        }
      />

      <section className={styles.scoreHero} aria-labelledby="score-title">
        <div className={styles.scoreHeroInner}>
          <div className={styles.scoreHeroContent}>
            <p>Your ADHD score</p>
            <h1 id="score-title">{resultLabel}</h1>
          </div>
          <ScoreGauge score={report.score} />
        </div>
      </section>

      <div className={styles.content}>
        <p className={styles.reportSummary}>
          Your full assessment results include IQ score, cognitive strengths profile, worldwide
          percentile rankings, and an in-depth breakdown of performance.
        </p>

        {scoreExplanation ? <UnderstandingScoreSection section={scoreExplanation} /> : null}
        {cognitiveStrengths ? <CognitiveStrengthsSection section={cognitiveStrengths} /> : null}
        {emotionalRegulation ? (
          <EmotionalRegulationSection section={emotionalRegulation} />
        ) : null}
        <FaqSection items={report.faq} />

        {error ? <p className={styles.formError}>{error}</p> : null}
      </div>

      <AppFooter />
    </main>
  );
}
