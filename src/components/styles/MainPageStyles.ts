// src/components/styles/MainPageStyles.ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  networkImage: ImageStyle;
  compareText: TextStyle;
  twoBtns: ViewStyle;
  button1: ViewStyle;
  button: ViewStyle;
  buttonText1: TextStyle;
  buttonText: TextStyle;
  input: TextStyle;  // Changed from ViewStyle to TextStyle
  buttonDisabled: ViewStyle;
 }

const styles = StyleSheet.create<Styles>({
 container: {
   flex: 1,
   backgroundColor: "#F0F4FF",
   alignItems: 'center',
   justifyContent: 'space-between',
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
 },
 networkImage: {
   width: '100%',
   height: 180,
   resizeMode: 'cover',
   marginVertical: 24,
   borderRadius: 8,
 },
 compareText: {
   fontSize: 20,
   color: '#2196F3',
   marginVertical: 20,
   fontWeight: '500',
 },
 twoBtns: {
  width: '100%',
  paddingHorizontal: 20,
},
 button1: {
   flex: 1,
   backgroundColor: 'white',
   borderRadius: 8,
   borderColor: '#2196F3',
   borderWidth: 1,
   height: 50,
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
   marginVertical: 16,
   marginHorizontal: 5,
   justifyContent: 'center',
 },
 button: {
   flex: 1,
   backgroundColor: '#2196F3',
   borderRadius: 8,
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
   marginVertical: 16,
   marginHorizontal: 5,
   justifyContent: 'center',
 },
 buttonText1: {
   color: '#2196F3',
   fontSize: 16,
   fontWeight: 'bold',
   textAlign: 'center',
   alignContent: 'center',
   letterSpacing: 0.5,
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
   textAlign: 'center',
   alignContent: 'center',
   letterSpacing: 0.5,
 },
 input: {
   height: 40,
   width: '80%',
   borderColor: 'gray',
   borderWidth: 1,
   borderRadius: 5,
   padding: 10,
   marginBottom: 20,
 },
 buttonDisabled: {
   opacity: 0.5
 },
});

export default styles;