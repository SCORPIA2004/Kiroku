import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import styles from "../styles/SuccessPage.module.css";
import { useEffect } from "react";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is found in storage, redirect to login page
  const savedUser =
    localStorage.getItem("loggedInUser") ||
    sessionStorage.getItem("loggedInUser");
    if (!savedUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Clear both localStorage and sessionStorage on logout
      localStorage.removeItem("loggedInUser");
      sessionStorage.removeItem("loggedInUser");

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
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </button>
    </div>
  );
};

export default SuccessPage;
