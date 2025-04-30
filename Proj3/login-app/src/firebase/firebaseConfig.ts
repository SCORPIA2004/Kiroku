// ./src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBN8u5R4X4icE82RF1SBPK5NxLls_RxPaQ",
  authDomain: "cs458-project-1-1e157.firebaseapp.com",
  projectId: "cs458-project-1-1e157",
  storageBucket: "cs458-project-1-1e157.firebasestorage.app",
  messagingSenderId: "392107684081",
  appId: "1:392107684081:web:ba4904ea81237fc3c87950",
  measurementId: "G-QKMZ2XXBXP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
