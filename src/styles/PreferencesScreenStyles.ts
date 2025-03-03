import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface PreferencesScreenStyles {
  screen: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  sectionContainer: ViewStyle;
  sectionTitle: TextStyle;
  divider: ViewStyle;
}

export const styles = StyleSheet.create<PreferencesScreenStyles>({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 24, // Space between each slider
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  }
});

export default styles;






