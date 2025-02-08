// LoginForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginForm.module.css";
import { auth } from "../firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "test@example.com" && password === "password123") {
      navigate("/success");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      navigate("/success"); // Redirect after login
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      navigate("/success"); // Redirect after login
    } catch (error) {
      console.error("Facebook login failed", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email or Phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <div className={styles.oauth}>
        <button onClick={handleGoogleLogin}>Login with Google</button>
        <button onClick={handleFacebookLogin}>Login with Facebook</button>
      </div>
    </div>
  );
};

export default LoginForm;
