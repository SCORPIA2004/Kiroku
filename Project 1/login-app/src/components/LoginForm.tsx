// LoginForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import Popup from "./Popup";
import { auth } from "../firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "test@example.com" && password === "password123") {
      navigate("/success");
    } else {
      setPopupMessage("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/success");
    } catch (error) {
      setPopupMessage("Google login failed. Please try again.");
      console.error("Google login failed", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/success");
    } catch (error) {
      setPopupMessage("Facebook login failed. Please try again.");
      console.error("Facebook login failed", error);
    }
  };

  return (
    <>
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
      <div className={styles.container}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Log in to continue</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        <p className={styles.orText}>or continue with</p>

        <div className={styles.oauth}>
          <button onClick={handleGoogleLogin} className={styles.googleBtn}>
            <FaGoogle />
          </button>
          <button onClick={handleFacebookLogin} className={styles.facebookBtn}>
            <FaFacebookF />
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
