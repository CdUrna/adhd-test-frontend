"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/button";
import { LoadingScreen } from "@/components/loading-screen";
import { PageShell } from "@/components/page-shell";
import { ResponsiveProfileImage } from "@/components/responsive-profile-image";
import { SurfaceCard } from "@/components/surface-card";
import { getCurrentUser } from "../../../auth/auth.api";
import { initializeQuizDraft } from "../../quiz-draft.storage";
import styles from "./landing-view.module.css";
import type { LandingViewProps } from "./landing-view.types";
import type { Gender } from "../../quiz.types";

export function LandingView({ skipSessionRedirect }: LandingViewProps) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(!skipSessionRedirect);

  useEffect(() => {
    if (skipSessionRedirect) return;

    let active = true;

    void getCurrentUser()
      .then((user) => {
        if (active && user) {
          router.replace("/report");
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router, skipSessionRedirect]);

  function start(gender: Gender): void {
    initializeQuizDraft(gender);
    router.push("/test");
  }

  if (isCheckingSession) {
    return (
      <LoadingScreen aria-live="polite">
        Loading…
      </LoadingScreen>
    );
  }

  return (
    <PageShell>
      <AppHeader />
      <SurfaceCard className={styles.card} aria-labelledby="page-title">
        <div className={styles.profileVisual} aria-hidden="true">
          <ResponsiveProfileImage
            className={styles.profileImage}
            width={273}
            height={237}
            sizes="(max-width: 600px) 169px, 220px"
            priority
          />
          <span className={`${styles.profileChip} ${styles.productivity}`}>High<br />Productivity</span>
          <span className={`${styles.profileChip} ${styles.impulsivity}`}>↗ +10% Impulsivity</span>
          <span className={`${styles.profileChip} ${styles.focus}`}>↘ -6% Focus</span>
          <span className={`${styles.profileChip} ${styles.distractions}`}>Medium<br />Distractions</span>
        </div>
        <h1 id="page-title">
          Discover Your <span>ADHD Trait Profile</span>
        </h1>
        <p>Find out how ADHD traits influence your focus, energy, and daily life.</p>

        <div className={styles.genderActions} aria-label="Select your gender">
          <Button type="button" onClick={() => start("MALE")}>
            Male
          </Button>
          <Button type="button" onClick={() => start("FEMALE")}>
            Female
          </Button>
        </div>
        <Button type="button" variant="link" className={styles.modeSwitch} onClick={() => router.push("/auth?mode=login")}>
          Already have an account? Sign in
        </Button>
      </SurfaceCard>
    </PageShell>
  );
}
