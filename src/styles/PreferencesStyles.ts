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
  sliderContainer: {
    width: '100%',
    marginVertical: 10,
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