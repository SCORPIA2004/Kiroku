// screens/SuccessScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SuccessScreen() {
  return (
    <View
      style={styles.container}
      testID="success-container"
      accessibilityLabel="success-container"
    >
      <Text
        style={styles.text}
        testID="success-message"
        accessibilityLabel="success-message"
      >
        Form submitted
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20 },
});
