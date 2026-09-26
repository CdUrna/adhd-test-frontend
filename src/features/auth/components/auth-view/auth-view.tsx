"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { LoadingScreen } from "@/components/loading-screen";
import { PageShell } from "@/components/page-shell";
import { AuthGate } from "../auth-gate";
import { readPendingAttempt } from "../../utils/read-pending-attempt";
import styles from "./auth-view.module.css";
import type { AuthViewProps } from "./auth-view.types";


export function AuthView({ standaloneLogin }: AuthViewProps) {
  const router = useRouter();
  const [claimToken, setClaimToken] = useState<string | undefined>();
  const [isReady, setIsReady] = useState(standaloneLogin);

  useEffect(() => {
    if (standaloneLogin) return;

    const attempt = readPendingAttempt();
    if (!attempt) {
      router.replace("/");
      return;
    }

    void Promise.resolve().then(() => {
      setClaimToken(attempt.claimToken);
      setIsReady(true);
    });
  }, [router, standaloneLogin]);

  if (!isReady) {
    return <LoadingScreen aria-live="polite">Loading…</LoadingScreen>;
  }

  return (
    <PageShell className={styles.shell}>
      <AppHeader className={styles.header} />
      <AuthGate
        claimToken={claimToken}
        initialMode={standaloneLogin ? "login" : "register"}
        allowRegistration={!standaloneLogin}
        onAuthenticated={() => router.replace("/report")}
        onCancel={standaloneLogin ? undefined : () => router.push("/")}
      />
    </PageShell>
  );
}
