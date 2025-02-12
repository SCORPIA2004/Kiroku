// SuccessPage.tsx
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import styles from "../styles/SuccessPage.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.heading}>Login Successful!</h2>
      <button
        name="logout-button"
      onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default SuccessPage;
