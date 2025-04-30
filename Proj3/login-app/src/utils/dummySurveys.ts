// src/utils/dummySurveys.ts
export interface Question {
  id: string;
  type: "mc" | "rating" | "text" | "dropdown" | "checkbox";
  prompt: string;
  options?: string[];
  required?: boolean;
  conditional?: { questionId: string; value: any };
}
export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

export const dummySurveys: Survey[] = [
  {
    id: "survey1",
    title: "Customer Satisfaction",
    questions: [
      {
        id: "q1",
        type: "mc",
        prompt: "Did you like our service?",
        options: ["Yes", "No"],
        required: true,
      },
      { id: "q2", type: "rating", prompt: "Rate our service", required: true },
      // …
    ],
  },
  // more…
  // lol where's the rest
];
