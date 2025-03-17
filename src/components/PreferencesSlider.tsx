import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/PreferencesStyles";
import { ThemeColors } from "../../core/hooks/ThemedContext";

interface PreferenceSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  theme?: ThemeColors;
}

const PreferenceSlider = ({
  label,
  value,
  onChange,
  theme,
}: PreferenceSliderProps) => {
  // Create exactly 6 tick marks for values 0-5
  const renderTicks = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.tick,
          theme && { backgroundColor: theme.separatorColor },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, theme && { color: theme.textColor }]}>
        {label}
      </Text>
      <View style={styles.sliderContainer}>
        <View style={styles.tickContainer}>{renderTicks()}</View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5}
          step={1}
          value={value}
          onSlidingComplete={onChange}
          minimumTrackTintColor={theme?.buttonBackgroundColor || "#2196F3"}
          thumbTintColor={theme?.buttonBackgroundColor || "#2196F3"}
        />
        {/* Use a more precise layout for the scale numbers */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingLeft: 0, // Align with first tick
            paddingRight: 0, // Align with last tick
          }}
        >
          <Text style={[styles.scaleText, theme && { color: theme.textColor }]}>
            0
          </Text>
          <View style={{ flex: 1 }}></View>
          <Text style={[styles.scaleText, theme && { color: theme.textColor }]}>
            5
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PreferenceSlider;
