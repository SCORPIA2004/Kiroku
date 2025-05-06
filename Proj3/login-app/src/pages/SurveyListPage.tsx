// src/pages/SurveyListPage.tsx
import { useNavigate } from "react-router-dom";
import { dummySurveys } from "../utils/dummySurveys";
import styles from "../styles/SurveyListPage.module.css";

const SurveyListPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Surveys</h2>
      <ul className={styles.list}>
        {dummySurveys.map((survey) => (
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
