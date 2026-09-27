"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { PageShell } from "@/components/page-shell";
import { SurfaceCard } from "@/components/surface-card";
import styles from "./error.module.css";
import type { TestErrorProps } from "./error.types";

export default function TestError({ reset }: TestErrorProps) {
  const router = useRouter();

  return (
    <PageShell>
      <SurfaceCard className={styles.card} role="alert">
        <h1>The test is temporarily unavailable</h1>
        <p>
          We could not load the questions. Check your connection and try again.
        </p>
        <div className={styles.actions}>
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Return to start
          </Button>
        </div>
      </SurfaceCard>
    </PageShell>
  );
}
