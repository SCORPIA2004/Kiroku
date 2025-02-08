import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SuccessPage from "./pages/SuccessPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
};

export default App;
