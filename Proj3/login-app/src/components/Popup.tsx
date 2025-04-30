// ./src/components/Popup.tsx
import React from "react";
import styles from "../styles/Popup.module.css";

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div name="popup-container" className={styles.popupOverlay}>
      <div className={styles.popup}>
        <p name="popup-message">{message}</p>
        <button name="popup-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
