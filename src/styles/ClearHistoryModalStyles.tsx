import { StyleSheet } from "react-native";

const ClearHistoryModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#1E90FF",
    backgroundColor: "#F0F8FF",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  warningText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    minWidth: 150,
    borderWidth: 2,
    borderColor: "#FF0000",
    backgroundColor: "#333333",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ClearHistoryModalStyles;















