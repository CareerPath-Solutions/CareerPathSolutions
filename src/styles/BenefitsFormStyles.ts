import { StyleSheet, ViewStyle, TextStyle } from "react-native";

interface BenefitsFormStyles {
  container: ViewStyle;
  heading: TextStyle;
  subheading: TextStyle;
  label: TextStyle;
  checkboxContainer: ViewStyle;
  checkbox: ViewStyle;
  checkboxInner: ViewStyle;
  checkboxLabel: TextStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
}

export default StyleSheet.create<BenefitsFormStyles>({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#F0F4FF",
    borderRadius: 10,
    margin: 10,
    marginTop: 50,
    justifyContent: "space-around",
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: '#2196F3',
    marginBottom: 35,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#333",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    backgroundColor: "transparent",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: "#2D72D9",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});