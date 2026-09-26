export type ReportResultType = "HIGH_ADHD_TRAITS" | "LOW_ADHD_TRAITS";

export type ReportSection = {
  key: string;
  type: "text" | "list";
  title: string;
  content: string;
  items?: string[];
  outro?: string;
};

export type ReportFaq = {
  question: string;
  answer: string;
};

export type CurrentReport = {
  attemptId: string;
  score: number;
  resultType: ReportResultType;
  completedAt: string;
  disclaimer: string;
  sections: ReportSection[];
  faq: ReportFaq[];
};
