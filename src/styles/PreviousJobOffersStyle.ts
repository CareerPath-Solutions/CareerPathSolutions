import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  scrollView: ViewStyle;
  container: ViewStyle;
  heading: TextStyle;
  gradeContainer: ViewStyle;
  label: TextStyle;
  grade: TextStyle;
  noOffersText: TextStyle;
  header: ViewStyle;
  homeBtn: ViewStyle;
  homeIcon: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    marginTop: 40,
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
  noOffersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    position: "relative",
  },
  homeBtn: {
    padding: 5,
    position: 'absolute',
    left: 5,
    zIndex: 1,
  },
  homeIcon: {
    width: 24,
    height: 24,
  },
});

export default styles;