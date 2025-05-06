// // src/utils/dummySurveys.ts

import { Survey } from "../types/survey";

export const dummySurveys: Survey[] = [
  {
    id: "s1",
    title: "Customer Feedback Survey",
    questions: [
      {
        id: "q1",
        prompt: "Did you enjoy the service?",
        type: "mc",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "q2",
        prompt: "Rate your experience (1-5)",
        type: "rating",
        required: true,
        conditional: { questionId: "q1", value: "Yes" },
      },
    ],
  },
];

// export interface Question {
//   id: string;
//   type: "mc" | "rating" | "text" | "dropdown" | "checkbox";
//   prompt: string;
//   options?: string[];
//   required?: boolean;
//   conditional?: { questionId: string; value: any };
// }
// export interface Survey {
//   id: string;
//   title: string;
//   questions: Question[];
// }

// export const dummySurveys: Survey[] = [
//   {
//     id: "survey1",
//     title: "Customer Satisfaction",
//     questions: [
//       {
//         id: "q1",
//         type: "mc",
//         prompt: "Did you like our service?",
//         options: ["Yes", "No"],
//         required: true,
//       },
//       { id: "q2", type: "rating", prompt: "Rate our service", required: true },
//       // …
//     ],
//   },
//   // more…
//   // lol where's the rest
// ];
