import type { ReportSection } from "../../report.types";

export type ReportListVariant = "emotional" | "strengths";

export type ReportListSectionProps = {
  section: ReportSection;
  variant: ReportListVariant;
};
