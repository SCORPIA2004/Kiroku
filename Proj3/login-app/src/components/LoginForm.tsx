// ./src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
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
import { credentials } from "../utils/data";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userExists = credentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (userExists) {
      if (rememberMe) {
        localStorage.setItem("loggedInUser", email); // Store user session
      } else {
        sessionStorage.setItem("loggedInUser", email); // Temporary session
      }
      navigate("/success");
    } else {
      setPopupMessage("Invalid email or password.");
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      navigate("/success");
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        localStorage.setItem("loggedInUser", user.email || "GoogleUser");
        navigate("/success");
      }
    } catch (error) {
      setPopupMessage("Google login failed. Please try again.");
      console.error("Google login failed", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        localStorage.setItem("loggedInUser", user.email || "FacebookUser");
        navigate("/success");
      }
    } catch (error) {
      setPopupMessage("Facebook login failed. Please try again.");
      console.error("Facebook login failed", error);
    }
  };

  useEffect(() => {
    const handleOffline = () => {
      setPopupMessage("No internet connection. Please check your network.");
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
            name="email"
            type="email"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button name="login-button" type="submit" className={styles.loginBtn}>
            Login
          </button>
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              name="remember-me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>
        </form>

        <p className={styles.orText}>or continue with</p>

        <div className={styles.oauth}>
          <button
            name="google-login"
            onClick={handleGoogleLogin}
            className={styles.googleBtn}
          >
            <FaGoogle />
          </button>
          <button
            name="facebook-login"
            onClick={handleFacebookLogin}
            className={styles.facebookBtn}
          >
            <FaFacebookF />
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
