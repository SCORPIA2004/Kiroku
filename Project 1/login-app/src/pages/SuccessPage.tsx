import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const SuccessPage = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>Login Successful!</h2>
      <button onClick={handleLogout} style={{ width: "10rem" }}>
        Logout
      </button>
    </div>
  );
};

export default SuccessPage;
