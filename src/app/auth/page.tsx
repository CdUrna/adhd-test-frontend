import { AuthView } from "@/features/auth/components/auth-view";
import type { AuthPageProps } from "./page.types";

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  return <AuthView standaloneLogin={params.mode === "login"} />;
}
