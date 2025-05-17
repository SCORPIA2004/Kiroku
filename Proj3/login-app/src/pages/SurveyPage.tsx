// src/pages/SurveyPage.tsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummySurveys } from "../utils/dummySurveys";
import { Question, Survey } from "../types/survey";
import emailjs from "@emailjs/browser";
import styles from "../styles/SurveyPage.module.css";

const SurveyPage: React.FC = () => {
  const currentUserEmail =
    localStorage.getItem("loggedInUser") ||
    sessionStorage.getItem("loggedInUser") ||
    "anonymous@example.com";

  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  /* ─────── AUTH GUARD ─────── */
  React.useEffect(() => {
    const user =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!user) navigate("/");
  }, [navigate]);

  // First try to load any saved/edited survey from localStorage;
  // if none, fall back to the dummySurveys.
  const survey: Survey | undefined = useMemo(() => {
    if (!surveyId) return undefined;
    const saved = localStorage.getItem("survey-" + surveyId);
    if (saved) {
      try {
        return JSON.parse(saved) as Survey;
      } catch {
        console.warn("Failed to parse saved survey:", surveyId);
      }
    }
    return dummySurveys.find((s) => s.id === surveyId);
  }, [surveyId]);

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
      return;
    }
    console.log("Submitted Answers:", answers);
    alert("Survey submitted successfully!");
    navigate("/surveys");

    // const payload = {
    //   to_email: currentUserEmail,
    //   survey_title: survey.title,
    //   survey_id: survey.id,
    //   // stringify answers nicely
    //   answers: JSON.stringify(answers, null, 2),
    // };

    // build lines of "Prompt: Answer"
    const lines = survey.questions
      .filter((q) => isVisible(q))
      .map((q) => {
        const ans = answers[q.id];
        // for arrays (checkbox), join with comma
        const display = Array.isArray(ans)
          ? ans.join(", ")
          : ans ?? "(no answer)";
        return `${q.prompt}: ${display}`;
      });

    const payload = {
      to_email: currentUserEmail,
      survey_title: survey.title,
      survey_id: survey.id,
      submitted_at: new Date().toLocaleString(),
      answers: lines.join("\n"),
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        payload,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY!
      )
      .then(() => {
        alert("Survey submitted & e-mailed successfully!");
        navigate("/surveys");
      })
      .catch((err) => {
        console.error("EmailJS error", err);
        alert("Survey saved, but e-mail failed.");
        navigate("/surveys");
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{survey.title}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {survey.questions.map((q) =>
          isVisible(q) ? (
            <div
              key={q.id}
              className={styles.question}
              id={`question-${q.id}`}
              name={`question-container-${q.id}`}
            >
              <label htmlFor={q.id}>{q.prompt}</label>
              {q.type === "mc" &&
                q.options?.map((opt, i) => (
                  <div key={i} className={styles.optionRow}>
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
                  id={q.id}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
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
                  const vals: string[] = answers[q.id] || [];
                  return (
                    <div key={i} className={styles.optionRow}>
                      <input
                        type="checkbox"
                        id={`${q.id}-chk${i}`}
                        name={q.id}
                        value={opt}
                        checked={vals.includes(opt)}
                        onChange={(e) => {
                          const newVals = e.target.checked
                            ? [...vals, opt]
                            : vals.filter((v) => v !== opt);
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
