import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/PreferencesStyles";

interface PreferenceSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const PreferenceSlider = ({
  label,
  value,
  onChange,
}: PreferenceSliderProps) => {
  const renderTicks = () =>
    Array(6)
      .fill(0)
      .map((_, index) => <View key={index} style={styles.tick} />);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.tickContainer}>{renderTicks()}</View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5}
          step={1}
          value={value}
          onSlidingComplete={onChange}
        />
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleText}>0</Text>
          <Text style={styles.scaleText}>5</Text>
        </View>
      </View>
    </View>
  );
};

export default PreferenceSlider;