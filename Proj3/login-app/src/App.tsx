// ./src/App.tsx
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SurveyListPage from "./pages/SurveyListPage";
import SurveyPage from "./pages/SurveyPage";
import SurveyDesignerPage from "./pages/SurveyDesignerPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/success" element={<SurveyListPage />} />
      <Route path="/surveys" element={<SurveyListPage />} />
      <Route path="/surveys/:surveyId" element={<SurveyPage />} />
      <Route path="/designer" element={<SurveyDesignerPage />} />
      <Route path="/designer/:surveyId" element={<SurveyDesignerPage />} />
    </Routes>
  );
};

export default App;
