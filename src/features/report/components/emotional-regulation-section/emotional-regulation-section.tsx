import { ReportListSection } from "../report-list-section";
import type { EmotionalRegulationSectionProps } from "./emotional-regulation-section.types";

export function EmotionalRegulationSection({ section }: EmotionalRegulationSectionProps) {
  return <ReportListSection section={section} variant="emotional" />;
}
