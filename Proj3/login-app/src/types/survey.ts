// ./src/types/survey.ts

export type QuestionType = "mc" | "rating" | "text" | "dropdown" | "checkbox";

export interface ConditionalRule {
  questionId: string;
  value: string | number | boolean;
}

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[]; // for MC, dropdown, checkbox
  required?: boolean;
  conditional?: ConditionalRule;
}

export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}
