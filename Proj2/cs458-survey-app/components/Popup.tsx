import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="popup-modal"
      accessibilityLabel="popup-modal"
    >
      <View
        style={styles.popupOverlay}
        testID="popup-overlay"
        accessibilityLabel="popup-overlay"
      >
        <View
          style={styles.popup}
          testID="popup-content"
          accessibilityLabel="popup-content"
        >
          <Text
            style={styles.popupMessage}
            testID="popup-message"
            accessibilityLabel="popup-message"
          >
            {message}
          </Text>
          <TouchableOpacity
            style={styles.popupClose}
            onPress={onClose}
            testID="popup-close-button"
            accessibilityLabel="popup-close-button"
          >
            <Text
              style={styles.popupCloseText}
              testID="popup-close-text"
              accessibilityLabel="popup-close-text"
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 24, // equivalent to 1.5rem * 16
    borderRadius: 8,
    // iOS shadow:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Android elevation:
    elevation: 5,
    alignItems: "center",
  },
  popupMessage: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  popupClose: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  popupCloseText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Popup;
