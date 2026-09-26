import { TestView } from "@/features/quiz/components/test-view";
import { getCurrentQuiz } from "@/features/quiz/quiz.api";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const quiz = await getCurrentQuiz();

  return <TestView initialQuiz={quiz} />;
}
