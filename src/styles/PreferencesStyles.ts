import { StyleSheet, ViewStyle, TextStyle } from "react-native";

interface Styles {
  container: ViewStyle;
  label: TextStyle;
  sliderContainer: ViewStyle;
  slider: ViewStyle;
  tickContainer: ViewStyle;
  tick: ViewStyle;
  scaleContainer: ViewStyle;
  scaleText: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 8,
  },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
  },
  slider: {
    width: "100%",
  },
  tickContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  tick: {
    width: 2,
    height: 8,
    backgroundColor: "#D1D5DB",
  },
  scaleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 4,
  },
  scaleText: {
    fontSize: 14,
    color: "#6B7280",
  },
});