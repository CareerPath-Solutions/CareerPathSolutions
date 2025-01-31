// src/components/CustomCheckbox.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: "#000",
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export const CustomCheckbox = ({ label, checked, onPress }: CheckboxProps) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
    <View style={styles.checkbox}>
      {checked && <View style={styles.checkboxInner} />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default CustomCheckbox;
