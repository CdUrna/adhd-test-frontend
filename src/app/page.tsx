import { LandingView } from "@/features/quiz/components/landing-view";
import type { HomePageProps } from "./page.types";

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  return <LandingView skipSessionRedirect={params.retake === "1"} />;
}
