import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 25,
    lineHeight: 24,
    maxWidth: 400,
    marginBottom: 40,
  },
  networkImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    marginVertical: 24,
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: "#2563EB",
    textAlign: 'center',
  },
  githubButton: {
    backgroundColor: '#24292e',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#24292e',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default styles;