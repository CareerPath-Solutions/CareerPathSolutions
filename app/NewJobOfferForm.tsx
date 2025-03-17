import React, { useState } from "react";
import { useTheme } from "../core/hooks/ThemedContext";
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
import styles from "../src/styles/NewJobOfferFormStyles";
import { jobOfferService } from "../business/services/jobOfferService";
import {
  AVAILABLE_POSITIONS,
  JobOfferDetails,
} from "../core/types/jobOffer.types";
import { Picker } from "@react-native-picker/picker";
type SearchParams = {
  username?: string;
};

/**
 *
 * @returns NewJobOfferForm component
 * This component allows users to enter details about a new job offer.
 */
export default function NewJobOfferForm() {
  const router = useRouter();
  const params = useLocalSearchParams<SearchParams>();
  const { theme, isDark } = useTheme();
  const username = params.username;
  const [companyName, setCompanyName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  /**
   * Function to handle form submission
   * This function collects the job offer details and sends them to the server.
   */
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
        pathname: "/BenefitForm",
        params: {
          salary: Number(salary),
          position,
          username: username || "",
          company_name: companyName,
        } as any,
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
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.textColor }]}>
            Hi, {username}
          </Text>
        </View>
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/JobOfferHeader.jpg")}
              style={styles.headerImage}
              accessible={true}
              accessibilityLabel="Job Offer Header Image"
            />
          </View>
          <Text style={[styles.heading, { color: theme.textColor }]}>
            New Job Offer Details
          </Text>
          <View style={styles.formContainer}>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark ? "#333" : "white",
                  borderColor: isDark ? "#333" : "#A3B4D8",
                  borderWidth: isDark ? 0 : 1,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackgroundColor,
                    color: theme.textColor,
                    borderColor: theme.backgroundColor,
                    borderWidth: 0,
                  },
                ]}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Company X"
                placeholderTextColor={theme.secondaryTextColor}
                accessibilityLabel="Enter Company Name"
                accessibilityHint="Enter the name of the company offering the position"
              />
              <Text style={[styles.label, { color: theme.textColor }]}>
                Company Name
              </Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark ? "#333" : "",
                  borderColor: isDark ? "#333" : "#A3B4D8",
                  borderWidth: isDark ? 0 : 1,
                },
              ]}
            >
              <Picker
                //style={styles.input}
                selectedValue={position}
                onValueChange={(itemValue) => setPosition(itemValue)}
                style={{
                  backgroundColor: isDark ? "#333" : theme.inputBackgroundColor,
                }}
              >
                <Picker.Item
                  label="Select a position..."
                  value=""
                  color={isDark ? "#fff" : "#000"}
                  //color="#000"
                />
                {AVAILABLE_POSITIONS.map((pos) => (
                  <Picker.Item
                    key={pos}
                    label={pos}
                    value={pos}
                    //PICKER TEXT COLOR
                    //color={isDark ? "#fff" : "#000"}
                    //color="#000"
                  />
                ))}
              </Picker>
              <Text style={[styles.label, { color: theme.textColor }]}>
                Position Applied For
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark ? "#333" : "white",
                  borderColor: isDark ? "#333" : "#A3B4D8",
                  borderWidth: isDark ? 0 : 1,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackgroundColor,
                    color: theme.textColor,
                    borderColor: theme.separatorColor,
                  },
                ]}
                value={salary}
                onChangeText={setSalary}
                placeholder="Salary"
                placeholderTextColor={theme.secondaryTextColor}
                keyboardType="numeric"
                accessibilityLabel="Enter Salary"
                accessibilityHint="Enter the annual salary offered"
              />
              <Text style={styles.label}>Salary Offered</Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDark ? "#333" : "white",
                  borderColor: isDark ? "#333" : "#A3B4D8",
                  borderWidth: isDark ? 0 : 1,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textArea,
                  {
                    marginBottom: 20,
                    backgroundColor: theme.inputBackgroundColor,
                    color: theme.textColor,
                    borderColor: theme.separatorColor,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Job Description/Notes"
                placeholderTextColor={theme.secondaryTextColor}
                multiline
                textAlignVertical="top"
                numberOfLines={4}
                accessibilityLabel="Enter Job Description"
                accessibilityHint="Enter details about the job and any additional notes"
              />
              <Text style={[styles.label, { color: theme.textColor }]}>
                About
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  marginBottom: 40,
                  backgroundColor: theme.buttonBackgroundColor,
                },
              ]}
              onPress={handleSubmit}
              accessibilityLabel="Submit Job Offer Details"
              accessibilityHint="Press to save job offer details and continue to benefits selection"
            >
              <Text
                style={[
                  styles.submitButtonText,
                  { color: theme.buttonTextColor },
                ]}
              >
                ➔
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
