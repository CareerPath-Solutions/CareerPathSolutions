import { StyleSheet } from 'react-native';

// Theme interfaces
export interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  outlineButtonBorderColor: string;
  separatorColor: string;
}

// Light theme
export const lightTheme: ThemeColors = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  secondaryTextColor: '#666666',
  buttonBackgroundColor: '#333333',
  buttonTextColor: '#FFFFFF',
  outlineButtonBorderColor: '#333333',
  separatorColor: '#EEEEEE',
};

// Dark theme
export const darkTheme: ThemeColors = {
  backgroundColor: '#121212',
  textColor: '#FFFFFF',
  secondaryTextColor: '#AAAAAA',
  buttonBackgroundColor: '#2A2A2A',
  buttonTextColor: '#FFFFFF',
  outlineButtonBorderColor: '#FFFFFF',
  separatorColor: '#333333',
};

// Settings screen styles
const SettingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  preferencesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  outlineButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helpLink: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  }
});

export default SettingsStyles;















