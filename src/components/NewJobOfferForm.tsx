// src/components/NewJobOfferForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import styles from "./styles/NewJobOfferFormStyles";
import { jobOfferService } from "../../business/services/jobOfferService";
import {
  AVAILABLE_POSITIONS,
  JobOfferDetails,
} from "../../core/types/jobOffer.types";

type SearchParams = {
  username?: string;
};

export default function NewJobOfferForm() {
  const router = useRouter();
  const params = useLocalSearchParams<SearchParams>();
  const username = params.username;

  const [companyName, setCompanyName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const formData: JobOfferDetails = {
        company_name: companyName,
        position,
        salary,
        description,
      };

      await jobOfferService.createNewJobOffer(formData);

      router.push({
        pathname: "/(tabs)",
        params: {
          salary,
          position,
          username: username,
          company_name: companyName,
        },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save job offer"
      );
      console.error("Error saving job offer:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hi, {username}</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/JobOfferHeader.jpg")}
              style={styles.headerImage}
              accessible={true}
              accessibilityLabel="Job Offer Header Image"
            />
          </View>

          <Text style={styles.heading}>New Job Offer Details</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Company X"
                accessibilityLabel="Enter Company Name"
                accessibilityHint="Enter the name of the company offering the position"
              />
              <Text style={styles.label}>Company Name</Text>
            </View>

            <View style={styles.inputContainer}>
              <Picker
                style={styles.input}
                selectedValue={position}
                onValueChange={(itemValue) => setPosition(itemValue)}
              >
                <Picker.Item label="Select a position..." value="" />
                {AVAILABLE_POSITIONS.map((pos) => (
                  <Picker.Item key={pos} label={pos} value={pos} />
                ))}
              </Picker>
              <Text style={styles.label}>Position Applied For</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={salary}
                onChangeText={setSalary}
                placeholder="Salary"
                keyboardType="numeric"
                accessibilityLabel="Enter Salary"
                accessibilityHint="Enter the annual salary offered"
              />
              <Text style={styles.label}>Salary Offered</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textArea, { marginBottom: 20 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Job Description/Notes"
                multiline
                textAlignVertical="top"
                numberOfLines={4}
                accessibilityLabel="Enter Job Description"
                accessibilityHint="Enter details about the job and any additional notes"
              />
              <Text style={styles.label}>About</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { marginBottom: 40 }]}
              onPress={handleSubmit}
              accessibilityLabel="Submit Job Offer Details"
              accessibilityHint="Press to save job offer details and continue to benefits selection"
            >
              <Text style={styles.submitButtonText}>➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
