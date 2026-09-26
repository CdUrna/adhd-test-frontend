"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { SurfaceCard } from "@/components/surface-card";
import { authenticate } from "../../auth.api";
import styles from "./auth-gate.module.css";
import type { AuthFormValues, AuthGateProps } from "./auth-gate.types";
import type { AuthMode } from "../../auth.types";

const authSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export function AuthGate({
  claimToken,
  initialMode = "register",
  allowRegistration = true,
  onAuthenticated,
  onCancel,
}: AuthGateProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  async function submit(values: AuthFormValues): Promise<void> {
    setServerError(null);

    try {
      const authenticated = await authenticate(mode, {
        ...values,
        claimToken,
      });
      window.sessionStorage.removeItem("adhd-anonymous-attempt");
      onAuthenticated(authenticated);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again.",
      );
    }
  }

  function switchMode(nextMode: AuthMode): void {
    setMode(nextMode);
    setServerError(null);
    reset();
  }

  const isLogin = mode === "login";
  const cardClassName = [styles.card, isLogin ? styles.login : styles.register]
    .filter(Boolean)
    .join(" ");

  return (
    <SurfaceCard size="compact" className={cardClassName} aria-labelledby="auth-title">
      <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
        <div className={styles.mainContent}>
          <div className={styles.intro}>
            <h1 id="auth-title">{isLogin ? "Sign in" : "Discover your ADHD Profile"}</h1>
            <p>
              {isLogin
                ? "Welcome back! Let’s continue your learning journey"
                : "Enter your email and create a password to access your full report."}
            </p>
          </div>

          <div className={styles.fields}>
            <label>
              <span className={styles.fieldLabel}>Email</span>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? <span className={styles.fieldError}>{errors.email.message}</span> : null}
            </label>

            <label>
              <span className={styles.fieldLabel}>Password</span>
              <input
                type="password"
                placeholder={isLogin ? "Password" : "Create Password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password ? (
                <span className={styles.fieldError}>{errors.password.message}</span>
              ) : null}
            </label>

            {serverError ? (
              <p className={styles.formError} role="alert">
                {serverError}
              </p>
            ) : null}
          </div>
        </div>

        <Button type="submit" className={styles.primaryAction} disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait…"
            : mode === "register"
              ? "Get My Results"
              : "Sign in"}
        </Button>
      </form>

      {allowRegistration ? (
        <Button
          type="button"
          variant="link"
          className={styles.modeSwitch}
          onClick={() => switchMode(mode === "register" ? "login" : "register")}
        >
          {mode === "register"
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </Button>
      ) : null}
      {onCancel ? (
        <Button type="button" variant="link" className={`${styles.modeSwitch} ${styles.secondaryLink}`} onClick={onCancel}>
          Back to the test
        </Button>
      ) : null}
    </SurfaceCard>
  );
}
