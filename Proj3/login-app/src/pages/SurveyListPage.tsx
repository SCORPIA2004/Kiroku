// src/pages/SurveyListPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Survey } from "../types/survey";
import { dummySurveys } from "../utils/dummySurveys";
import styles from "../styles/SurveyListPage.module.css";

const SurveyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    // 1. load all saved surveys from localStorage
    const saved: Survey[] = Object.keys(localStorage)
      .filter((key) => key.startsWith("survey-"))
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key)!) as Survey;
        } catch {
          return null;
        }
      })
      .filter((s): s is Survey => !!s);

    // 2. merge with dummySurveys (override any matching id, then append new ones)
    const merged = [
      ...dummySurveys.map((d) => saved.find((s) => s.id === d.id) || d),
      ...saved.filter((s) => !dummySurveys.some((d) => d.id === s.id)),
    ];

    setSurveys(merged);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Surveys</h2>
      <ul className={styles.list}>
        {surveys.map((survey) => (
          <li key={survey.id} className={styles.surveyItem}>
            <h3>{survey.title}</h3>
            <div className={styles.actions}>
              <button
                name="take-survey"
                id={`take-${survey.id}`}
                onClick={() => navigate(`/surveys/${survey.id}`)}
              >
                Take Survey
              </button>
              <button
                name="edit-survey"
                id={`edit-${survey.id}`}
                onClick={() => navigate(`/designer/${survey.id}`)}
              >
                Edit Survey
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        name="create-survey"
        className={styles.createButton}
        onClick={() => navigate("/designer")}
      >
        + Create New Survey
      </button>
    </div>
  );
};

export default SurveyListPage;
