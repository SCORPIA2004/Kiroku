// screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App"; // Adjust the path if needed
import styles from "../styles/styles"; // adjust path if needed
import Popup from "../components/Popup";

// Dummy credentials array (you can move this to utils/data.ts later)
const credentials = [
  { email: "test@example.com", password: "1" },
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
  const [rememberMe, setRememberMe] = useState(false); // You can add a switch later
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = () => {
    const userExists = credentials.some(
      (cred) => cred.email === email && cred.password === password
    );
    if (userExists) {
      // Navigate to the Survey screen (or Success screen if preferred)
      navigation.navigate("Survey");
    } else {
      setPopupMessage("Invalid email or password.");
      setPopupVisible(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
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
