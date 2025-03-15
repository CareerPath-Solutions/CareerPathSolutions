import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#2196F3',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
    alignSelf: 'center',
  },
  sliderContainer: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tickContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    paddingHorizontal: 8, // Add padding to match the labels
  },
  tick: {
    width: 2,
    height: 10,
    backgroundColor: '#555',
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0, // Remove any padding
  },
  scaleText: {
    fontSize: 16,
    color: '#555',
    // Center the text under the tick marks
    width: 20, // Fixed width for the text
    textAlign: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderValue: {
    fontSize: 14,
    color: '#666',
  }
});