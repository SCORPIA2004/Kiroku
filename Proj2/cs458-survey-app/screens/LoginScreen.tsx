// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import "expo-dev-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import styles from "../styles/styles";
import Popup from "../components/Popup";

// Dummy credentials array
const credentials = [
  { email: "test@example.com", password: "1" },
  { email: "cs458proj2@zohomail.eu", password: "dG:]31ZYx=r5" },
  { email: "user1@example.com", password: "securepass1" },
  { email: "admin@example.com", password: "admin123" },
  { email: "doctor@example.com", password: "medic987" },
  { email: "staff@example.com", password: "staffpass" },
];

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = () => {
    const userExists = credentials.some(
      (cred) => cred.email === email && cred.password === password
    );
    if (userExists) {
      navigation.navigate("Survey", { email });
    } else {
      setPopupMessage("Invalid email or password.");
      setPopupVisible(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View
      style={styles.container}
      testID="login-screen"
      accessibilityLabel="login-screen"
    >
      <Text style={styles.title}>Hello there</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        testID="email-input"
        accessibilityLabel="email-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
        accessibilityLabel="password-input"
      />
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleSubmit}
        testID="login-button"
        accessibilityLabel="login-button"
      >
        <Text style={styles.loginBtnText}>Login</Text>
      </TouchableOpacity>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
}
