// src/pages/SurveyPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { dummySurveys } from "../utils/dummySurveys";
import { Question } from "../types/survey";
import styles from "../styles/SurveyPage.module.css";

const SurveyPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const survey = useMemo(
    () => dummySurveys.find((s) => s.id === surveyId),
    [surveyId]
  );

  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<string[]>([]);

  if (!survey) return <p>Survey not found</p>;

  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isVisible = (q: Question): boolean => {
    if (!q.conditional) return true;
    return answers[q.conditional.questionId] === q.conditional.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = survey.questions
      .filter((q) => q.required && isVisible(q) && !answers[q.id])
      .map((q) => q.id);

    if (missing.length) {
      setErrors(missing);
    } else {
      console.log("Submitted Answers:", answers);
      alert("Survey submitted successfully!");
      navigate("/surveys");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{survey.title}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {survey.questions.map((q) =>
          isVisible(q) ? (
            <div key={q.id} className={styles.question} id={`question-${q.id}`}>
              <label htmlFor={q.id}>{q.prompt}</label>
              {q.type === "mc" &&
                q.options?.map((opt, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={() => handleChange(q.id, opt)}
                      id={`${q.id}-opt${i}`}
                      checked={answers[q.id] === opt}
                    />
                    <label htmlFor={`${q.id}-opt${i}`}>{opt}</label>
                  </div>
                ))}
              {q.type === "rating" && (
                <select
                  name={q.id}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
                  id={q.id}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              )}
              {q.type === "text" && (
                <input
                  type="text"
                  id={q.id}
                  name={q.id}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "dropdown" && (
                <select
                  id={q.id}
                  name={q.id}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                >
                  <option value="">Select</option>
                  {q.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {q.type === "checkbox" &&
                q.options?.map((opt, i) => {
                  const values = answers[q.id] || [];
                  return (
                    <div key={i}>
                      <input
                        type="checkbox"
                        id={`${q.id}-chk${i}`}
                        name={q.id}
                        value={opt}
                        checked={values.includes(opt)}
                        onChange={(e) => {
                          const newVals = e.target.checked
                            ? [...values, opt]
                            : values.filter((v: string) => v !== opt);
                          handleChange(q.id, newVals);
                        }}
                      />
                      <label htmlFor={`${q.id}-chk${i}`}>{opt}</label>
                    </div>
                  );
                })}
              {errors.includes(q.id) && (
                <p className={styles.error}>This question is required</p>
              )}
            </div>
          ) : null
        )}
        <button name="submit-survey" id="submit-survey" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SurveyPage;
