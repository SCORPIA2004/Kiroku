// screens/SurveyScreen.tsx
import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../App";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import emailjs from "emailjs-com";

import styles from "../styles/SurveyScreen";

type SurveyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Survey"
>;

export default function SurveyScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Survey">>();
  const navigation = useNavigation<SurveyScreenNavigationProp>();
  const userEmail = route.params.email;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [education, setEducation] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const aiModels = ["ChatGPT", "Gemini", "Claude", "Deepseek"];
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [defects, setDefects] = useState<{ [model: string]: string }>({});
  const [useCase, setUseCase] = useState("");

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const isFormComplete = () => {
    const hasBasicInfo =
      name && surname && birthDate && education && city && gender;
    const hasModelDefects = selectedModels.every((model) =>
      defects[model]?.trim()
    );
    const hasUseCase = useCase.trim().length > 0;
    return (
      hasBasicInfo && selectedModels.length > 0 && hasModelDefects && hasUseCase
    );
  };

  const handleSend = () => {
    setLoading(true);
    const templateParams = {
      to_email: userEmail,
      name: name,
      surname: surname,
      birthDate: birthDate?.toDateString(),
      education,
      city,
      gender,
      selectedModels: selectedModels.join(", "),
      useCase,
      defects: selectedModels.map((m) => `${m}: ${defects[m]}`).join("\n"),
    };

    emailjs
      .send(
        "service_qhscnqn",
        "template_p1hhy8i",
        templateParams,
        "Z08vVgzlL6Jd0XJSS"
      )
      .then(() => {
        Alert.alert(
          "Success",
          "Survey sent successfully! Results have been sent to your email: " +
            userEmail
        );
        navigation.navigate("Success");
      })
      .catch((error) => {
        console.error("Email failed:", error);
        Alert.alert("Error", "Failed to send survey.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Usage Survey</Text>
        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
        {/* Birth Date */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>
            {birthDate ? birthDate.toDateString() : "Select Birth Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setBirthDate(selectedDate);
            }}
          />
        )}
        {/* Education Level */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={education}
            onValueChange={(itemValue) => setEducation(itemValue)}
          >
            <Picker.Item label="Select Education Level" value="" />
            <Picker.Item label="High School" value="High School" />
            <Picker.Item label="Bachelor's Degree" value="Bachelor" />
            <Picker.Item label="Master's Degree" value="Master" />
            <Picker.Item label="Ph.D." value="PhD" />
          </Picker>
        </View>
        {/* City */}
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        {/* Gender */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
          </Picker>
        </View>
        <Text style={styles.subheading}>
          Which AI models have you used? (Select ≥ 1)
        </Text>
        {aiModels.map((model) => (
          <View key={model} style={styles.checkboxRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleModel(model)}
            >
              <FontAwesome
                name={
                  selectedModels.includes(model) ? "check-square-o" : "square-o"
                }
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{model}</Text>
          </View>
        ))}
        {selectedModels.map((model) => (
          <TextInput
            key={`defect-${model}`}
            style={styles.input}
            placeholder={`Defects/Cons of ${model}`}
            value={defects[model] || ""}
            onChangeText={(text) =>
              setDefects((prev) => ({ ...prev, [model]: text }))
            }
          />
        ))}

        <Text style={styles.subheading}>
          How do you use AI in your daily life?
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write here..."
          multiline
          numberOfLines={4}
          value={useCase}
          onChangeText={setUseCase}
        />

        {isFormComplete() &&
          (loading ? (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={{ marginTop: 20 }}
            />
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
}
