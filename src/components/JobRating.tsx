// src/components/JobRating.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "./styles/JobRatingStyles";
import { JobRatingData } from "../../core/types/rating.types";

/**
 * Component for displaying the job rating details.
 * This includes grades for benefits, paid leave, salary, and an overall grade.
 */
export default function JobRating(): JSX.Element {
  const params = useLocalSearchParams();
  const router = useRouter();

  /**
   * Parsed job rating data from the navigation parameters.
   * 'data' contains grades for benefits, paid leave, salary, and the overall grade.
   */
  const data: JobRatingData | null = params.data
    ? JSON.parse(String(params.data))
    : null;

  console.log("JobRating received data:", data);

  /**
   * Handles navigation to the home screen
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.homeBtn} onPress={handleHomePress}>
          <Image
            source={require("../assets/images/HomeSymbol.png")}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>{data.companyName}</Text>
      </View>

      <View style={styles.gradeContainer}>
        <Text style={styles.label}>Benefits:</Text>
        <Text style={styles.grade}>{data.benefits}</Text>
      </View>

      <View style={styles.gradeContainer}>
        <Text style={styles.label}>Paid Leave:</Text>
        <Text style={styles.grade}>{data.paidLeave}</Text>
      </View>

      <View style={styles.gradeContainer}>
        <Text style={styles.label}>Salary:</Text>
        <Text style={styles.grade}>{data.salary}</Text>
      </View>

      <Text style={styles.overallGrade}>
        Overall Grade: {data.overallGrade}
      </Text>
    </View>
  );
}
