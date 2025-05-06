// // src/utils/dummySurveys.ts
import { Survey } from "../types/survey";

/**
 * Five varied sample surveys:
 *   • cover every QuestionType at least twice
 *   • mix required vs. optional
 *   • include multi‑select checkboxes, dropdowns, conditionals, ratings, text
 *   • demonstrate nested conditionals (Q4 depends on Q3 which depends on Q1)
 */
export const dummySurveys: Survey[] = [
  /* ───────────────────────────────────────────── */
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
        prompt: "Rate your experience (1‑5)",
        type: "rating",
        required: true,
        conditional: { questionId: "q1", value: "Yes" },
      },
      {
        id: "q3",
        prompt: "Tell us what went wrong.",
        type: "text",
        required: true,
        conditional: { questionId: "q1", value: "No" },
      },
    ],
  },

  /* ───────────────────────────────────────────── */
  {
    id: "s2",
    title: "Employee Satisfaction Pulse",
    questions: [
      {
        id: "q1",
        prompt: "Select your department(s):",
        type: "checkbox",
        options: ["Engineering", "Marketing", "HR", "Finance", "Other"],
        required: true,
      },
      {
        id: "q2",
        prompt: "Overall job satisfaction (1‑5)",
        type: "rating",
        required: true,
      },
      {
        id: "q3",
        prompt: "Would you recommend working here?",
        type: "mc",
        options: ["Definitely", "Maybe", "No"],
      },
      {
        id: "q4",
        prompt: "What could we improve?",
        type: "text",
        conditional: { questionId: "q3", value: "No" },
      },
    ],
  },

  /* ───────────────────────────────────────────── */
  {
    id: "s3",
    title: "Event Registration Form",
    questions: [
      {
        id: "q1",
        prompt: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q2",
        prompt: "Ticket type",
        type: "dropdown",
        options: ["Standard", "VIP", "Student"],
        required: true,
      },
      {
        id: "q3",
        prompt: "Select workshops (max 2)",
        type: "checkbox",
        options: ["Docker 101", "AI Basics", "React Advanced"],
        required: true,
        conditional: { questionId: "q2", value: "VIP" },
      },
      {
        id: "q4",
        prompt: "Dietary restrictions",
        type: "text",
      },
    ],
  },

  /* ───────────────────────────────────────────── */
  {
    id: "s4",
    title: "Website Usability Study",
    questions: [
      {
        id: "q1",
        prompt: "How often do you visit our site?",
        type: "dropdown",
        options: ["Daily", "Weekly", "Monthly", "First time"],
      },
      {
        id: "q2",
        prompt: "Ease of navigation",
        type: "rating",
        required: true,
      },
      {
        id: "q3",
        prompt: "Found everything you needed?",
        type: "mc",
        options: ["Yes", "No"],
        required: true,
      },
      {
        id: "q4",
        prompt: "What couldn't you find?",
        type: "text",
        conditional: { questionId: "q3", value: "No" },
      },
      {
        id: "q5",
        prompt: "Which features do you value? (choose all that apply)",
        type: "checkbox",
        options: ["Search", "Filtering", "Reviews", "Wish‑list"],
      },
    ],
  },

  /* ───────────────────────────────────────────── */
  {
    id: "s5",
    title: "Mobile App Beta Feedback",
    questions: [
      {
        id: "q1",
        prompt: "Platform used",
        type: "mc",
        options: ["iOS", "Android"],
        required: true,
      },
      {
        id: "q2",
        prompt: "App stability (1‑5)",
        type: "rating",
        required: true,
      },
      {
        id: "q3",
        prompt: "Dark‑mode preference",
        type: "mc",
        options: ["Love it", "Neutral", "Disable"],
      },
      {
        id: "q4",
        prompt: "Favorite feature",
        type: "dropdown",
        options: ["Offline mode", "Sync", "Push notifications", "UI design"],
      },
      {
        id: "q5",
        prompt: "Additional comments",
        type: "text",
      },
    ],
  },
];
