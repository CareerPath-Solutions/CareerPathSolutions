import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default styles;