// src/components/styles/JobRatingStyles.ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

interface JobRatingStyles {
 container: ViewStyle;
 headerImage: ImageStyle;
 heading: TextStyle;
 gradeContainer: ViewStyle;
 label: TextStyle;
 grade: TextStyle;
 overallGrade: TextStyle;
 header: ViewStyle;
 homeBtn: ViewStyle;
 homeIcon: ImageStyle;
}

const styles = StyleSheet.create<JobRatingStyles>({
 container: {
   backgroundColor: "#F0F4FF",
   padding: 20,
   borderRadius: 10,
   margin: 10,
   marginTop: 40,
 },
 headerImage: {
   width: '100%',
   height: 200,
   marginBottom: 20,
 },
 heading: {
   flex: 1,
   fontSize: 24,
   textAlign: "center",
   fontWeight: "bold",
   color: "#333",
   marginBottom: 20,
 },
 gradeContainer: {
   flexDirection: "row",
   justifyContent: "space-between",
   alignItems: "center",
   paddingVertical: 15,
   borderBottomWidth: 1,
   borderBottomColor: "#eee",
   marginVertical: 5,
 },
 label: {
   fontSize: 16,
   color: "#fff",
   fontWeight: "500",
   backgroundColor: "#2196F3",
   padding: 12,
   minWidth: 150,
   borderRadius: 6,
 },
 grade: {
   fontSize: 18,
   fontWeight: "600",
   color: "#333",
   marginRight: 20,
 },
 overallGrade: {
   fontSize: 24,
   fontWeight: "bold",
   color: "#333",
   marginTop: 20,
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   width: '100%',
   paddingHorizontal: 10,
   marginBottom: 20,
   position: 'relative',
 },
 homeBtn: {
   padding: 5,
   position: 'absolute',
   left: 5,
   zIndex: 1,
   borderColor: "gray",
   borderWidth: 3,
   borderRadius: 5
 },
 homeIcon: {
   width: 24,
   height: 24,
 },
});

export default styles;