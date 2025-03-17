import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "../src/styles/JobRatingStyles";
import { JobRatingData } from "../core/types/rating.types";
import { useTheme } from "../core/hooks/ThemedContext";

/**
 *
 * @returns JobRating component
 * This component displays the job rating information including benefits, paid leave, salary, and overall grade.
 */
export default function JobRating(): JSX.Element {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useTheme();

  /**
   * State variable to hold the job rating data
   * The data is passed as a parameter and parsed from JSON format.
   */
  const data: JobRatingData | null = params.data
    ? JSON.parse(String(params.data))
    : null;

  console.log("JobRating received data:", data);

  /**
   * Function to handle navigation to the home screen
   * This function uses the router to navigate to the home screen.
   */
  const handleHomePress = (): void => {
    router.push("/");
  };

  // Render a loading state if data is not available.
  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.homeBtn} onPress={handleHomePress}>
            <Image
              source={require("../assets/images/HomeSymbol.png")}
              style={styles.homeIcon}
            />
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.textColor }]}>
            {data.companyName}
          </Text>
        </View>

        <View style={styles.gradeContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Benefits:
          </Text>
          <Text style={[styles.grade, { color: theme.textColor }]}>
            {data.benefits}
          </Text>
        </View>

        <View style={styles.gradeContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Paid Leave:
          </Text>
          <Text style={[styles.grade, { color: theme.textColor }]}>
            {data.paidLeave}
          </Text>
        </View>

        <View style={styles.gradeContainer}>
          <Text style={[styles.label, { color: theme.textColor }]}>
            Salary:
          </Text>
          <Text style={[styles.grade, { color: theme.textColor }]}>
            {data.salary}
          </Text>
        </View>

        <Text style={[styles.overallGrade, { color: theme.textColor }]}>
          Overall Grade: {data.overallGrade}
        </Text>
      </View>
    </View>
  );
}
