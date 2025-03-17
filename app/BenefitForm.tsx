import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../src/styles/BenefitsFormStyles";
import { BenefitSelections, CheckboxProps } from "../core/types/benefits.types";
import { benefitsService } from "../business/services/benefitsService";
import { useTheme } from "../core/hooks/ThemedContext";

/**
 *
 * @returns BenefitForm component
 * This component allows users to select benefits and submit them for evaluation.
 */
export default function BenefitForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  const companyName = String(params.company_name);
  const username = String(params.username);
  const offeredSalary = Number(params.salary);
  const position = String(params.position);

  const [selections, setSelections] = useState<BenefitSelections>({
    health_care: false,
    vision: false,
    vacation_time: false,
    sick_time: false,
    maternity_leave: false,
    paternity_leave: false,
    religious_leave: false,
    stock_options: false,
    retirement_401k: false,
  });

  /**
   *
   * @param key - The key of the benefit selection to toggle
   * This function toggles the selected state of a checkbox.
   */
  const handleCheckboxChange = (key: keyof BenefitSelections) => {
    setSelections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    try {
      const grades = await benefitsService.submitBenefits(
        username,
        companyName,
        position,
        offeredSalary,
        selections
      );

      router.push({
        pathname: "/JobRating",
        params: {
          data: JSON.stringify({
            benefits: grades.benefits,
            paidLeave: grades.timeOff,
            salary: grades.salary,
            overallGrade: grades.overall,
            companyName: companyName,
          }),
        },
      } as any);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   *
   * @param param0 - The props for the CustomCheckbox component
   * @param label - The label for the checkbox
   * @returns
   */
  const CustomCheckbox = ({ label, checked, onPress }: CheckboxProps) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, { borderColor: theme.textColor }]}>
        {checked && (
          <View
            style={[
              styles.checkboxInner,
              { backgroundColor: theme.buttonBackgroundColor },
            ]}
          />
        )}
      </View>
      <Text style={[styles.checkboxLabel, { color: theme.textColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Text style={[styles.heading, { color: theme.textColor }]}>
        New Job Offer Details
      </Text>
      <Text style={[styles.subheading, { color: theme.secondaryTextColor }]}>
        Please Select All That Apply
      </Text>

      <Text style={[styles.label, { color: theme.textColor }]}>Benefits:</Text>
      <CustomCheckbox
        label="Health Care"
        checked={selections.health_care}
        onPress={() => handleCheckboxChange("health_care")}
      />
      <CustomCheckbox
        label="Vision"
        checked={selections.vision}
        onPress={() => handleCheckboxChange("vision")}
      />
      <CustomCheckbox
        label="Stock Options"
        checked={selections.stock_options}
        onPress={() => handleCheckboxChange("stock_options")}
      />
      <CustomCheckbox
        label="401k Retirement"
        checked={selections.retirement_401k}
        onPress={() => handleCheckboxChange("retirement_401k")}
      />

      <Text style={[styles.label, { color: theme.textColor }]}>Time Off:</Text>
      <CustomCheckbox
        label="Vacation Time"
        checked={selections.vacation_time}
        onPress={() => handleCheckboxChange("vacation_time")}
      />
      <CustomCheckbox
        label="Sick Time"
        checked={selections.sick_time}
        onPress={() => handleCheckboxChange("sick_time")}
      />
      <CustomCheckbox
        label="Maternity Leave"
        checked={selections.maternity_leave}
        onPress={() => handleCheckboxChange("maternity_leave")}
      />
      <CustomCheckbox
        label="Paternity Leave"
        checked={selections.paternity_leave}
        onPress={() => handleCheckboxChange("paternity_leave")}
      />
      <CustomCheckbox
        label="Religious Leave"
        checked={selections.religious_leave}
        onPress={() => handleCheckboxChange("religious_leave")}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
}
