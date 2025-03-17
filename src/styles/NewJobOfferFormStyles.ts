import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#F0F4FF",
        borderRadius: 10,
        margin: 10,
        justifyContent: "space-evenly",
    },
    imageContainer: {
        width: '120%',
        height: 150,
        marginLeft: -20,
        marginRight: -20,
        marginTop: 18,
        zIndex: 1,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#2196F3',
        marginVertical: 15,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "#A3B4D8",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "white",
        marginBottom: 15,
    },
    input: {
        fontSize: 16,
        color: "#333",
    },
    label: {
        fontSize: 14,
        color: "#A3B4D8",
        position: "absolute",
        right: 10,
    },
    textArea: {
        fontSize: 16,
        color: "#333",
        height: 80,
        minHeight: 100,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        marginTop: 7,
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 20,
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
    },
    greeting: {
        fontSize: 28,
        paddingVertical: 16,
        color: 'white',
        marginVertical: 8,
      },
      greetingContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2
      },
});

export default styles;