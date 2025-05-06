// src/pages/SurveyDesignerPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummySurveys } from "../utils/dummySurveys";
import { Survey, Question, QuestionType } from "../types/survey";
import styles from "../styles/SurveyDesignerPage.module.css";

const SurveyDesignerPage: React.FC = () => {
  const { surveyId } = useParams<{ surveyId?: string }>();
  const navigate = useNavigate();

  /* ─────── AUTH GUARD ─────── */
  React.useEffect(() => {
    const user =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!user) navigate("/");
  }, [navigate]);

  // Initialize survey state (load existing or new)
  const initialSurvey: Survey = useMemo(() => {
    if (surveyId) {
      const saved = localStorage.getItem("survey-" + surveyId);
      if (saved) return JSON.parse(saved);
      const found = dummySurveys.find((s) => s.id === surveyId);
      return found ? { ...found } : { id: surveyId, title: "", questions: [] };
    }
    return { id: String(Date.now()), title: "", questions: [] };
  }, [surveyId]);

  const [survey, setSurvey] = useState<Survey>(initialSurvey);

  // Question form state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qPrompt, setQPrompt] = useState("");
  const [qType, setQType] = useState<QuestionType>("mc");
  const [qOptions, setQOptions] = useState<string[]>([""]);
  const [qRequired, setQRequired] = useState(false);
  const [showConditional, setShowConditional] = useState(false);
  const [qConditional, setQConditional] = useState<{
    questionId: string;
    value: string;
  }>({ questionId: "", value: "" });

  // Populate form when editing
  useEffect(() => {
    if (editingQuestion) {
      setQPrompt(editingQuestion.prompt);
      setQType(editingQuestion.type);
      setQOptions(editingQuestion.options || [""]);
      setQRequired(Boolean(editingQuestion.required));
      setShowConditional(Boolean(editingQuestion.conditional));
      setQConditional(
        editingQuestion.conditional || { questionId: "", value: "" }
      );
    } else {
      resetForm();
    }
  }, [editingQuestion]);

  const resetForm = () => {
    setEditingQuestion(null);
    setQPrompt("");
    setQType("mc");
    setQOptions([""]);
    setQRequired(false);
    setShowConditional(false);
    setQConditional({ questionId: "", value: "" });
  };

  const handleAddOrUpdate = () => {
    const id = editingQuestion?.id || String(Date.now());
    const newQ: Question = {
      id,
      prompt: qPrompt,
      type: qType,
      options:
        qType === "mc" || qType === "dropdown" || qType === "checkbox"
          ? qOptions.filter((o) => o.trim() !== "")
          : undefined,
      required: qRequired,
      conditional:
        showConditional && qConditional.questionId ? qConditional : undefined,
    };

    setSurvey((prev) => {
      const questions = editingQuestion
        ? prev.questions.map((q) => (q.id === id ? newQ : q))
        : [...prev.questions, newQ];
      return { ...prev, questions };
    });
    resetForm();
  };

  const handleDelete = (id: string) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
    if (editingQuestion?.id === id) resetForm();
  };

  const handleSaveSurvey = () => {
    localStorage.setItem("survey-" + survey.id, JSON.stringify(survey));
    alert("Survey saved");
    navigate("/surveys");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {surveyId ? "Edit Survey" : "Create New Survey"}
      </h2>

      <label>
        Survey Title:
        <input
          name="survey-title"
          value={survey.title}
          onChange={(e) =>
            setSurvey((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>

      <div className={styles.questionForm}>
        <h3>{editingQuestion ? "Edit" : "Add"} Question</h3>
        <label>
          Prompt:
          <input
            name="designer-prompt"
            value={qPrompt}
            onChange={(e) => setQPrompt(e.target.value)}
          />
        </label>

        <label>
          Type:
          <select
            name="designer-type"
            value={qType}
            onChange={(e) => setQType(e.target.value as QuestionType)}
          >
            <option value="mc">Multiple Choice</option>
            <option value="rating">Rating Scale</option>
            <option value="text">Open-Ended Text</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </label>

        {(qType === "mc" || qType === "dropdown" || qType === "checkbox") && (
          <div>
            <h4>Options</h4>
            {qOptions.map((opt, i) => (
              <input
                key={i}
                name="designer-option"
                value={opt}
                onChange={(e) => {
                  const arr = [...qOptions];
                  arr[i] = e.target.value;
                  setQOptions(arr);
                }}
              />
            ))}
            <button
              name="add-option"
              id={`add-option-${qOptions.length}`}
              onClick={() => setQOptions([...qOptions, ""])}
            >
              Add Option
            </button>
          </div>
        )}

        <label>
          <input
            type="checkbox"
            name="designer-required"
            checked={qRequired}
            onChange={() => setQRequired(!qRequired)}
          />
          Required
        </label>

        <label>
          <input
            type="checkbox"
            name="designer-conditional-toggle"
            checked={showConditional}
            onChange={() => setShowConditional(!showConditional)}
          />
          Conditional Logic
        </label>

        {showConditional && (
          <div>
            <label>
              If Question:
              <select
                name="designer-conditional-question"
                value={qConditional.questionId}
                onChange={(e) =>
                  setQConditional((prev) => ({
                    ...prev,
                    questionId: e.target.value,
                  }))
                }
              >
                <option value="">Select Question</option>
                {survey.questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.prompt}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Equals Value:
              <input
                name="designer-conditional-value"
                value={qConditional.value}
                onChange={(e) =>
                  setQConditional((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        )}

        <button name="save-question" onClick={handleAddOrUpdate}>
          {editingQuestion ? "Update Question" : "Add Question"}
        </button>
      </div>

      <div className={styles.preview}>
        <h3>Preview Questions</h3>
        <ul>
          {survey.questions.map((q) => (
            <li key={q.id} id={`preview-${q.id}`}>
              <span>
                {q.prompt} ({q.type})
              </span>
              <button
                name="edit-question"
                onClick={() => setEditingQuestion(q)}
              >
                Edit
              </button>
              <button name="delete-question" onClick={() => handleDelete(q.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button name="save-survey" onClick={handleSaveSurvey}>
        Save Survey
      </button>
    </div>
  );
};

export default SurveyDesignerPage;
