import { ReportListSection } from "../report-list-section";
import type { CognitiveStrengthsSectionProps } from "./cognitive-strengths-section.types";

export function CognitiveStrengthsSection({ section }: CognitiveStrengthsSectionProps) {
  return <ReportListSection section={section} variant="strengths" />;
}
