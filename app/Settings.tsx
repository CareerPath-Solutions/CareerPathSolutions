import React, { useState, useEffect } from "react";
import { View, Text, Image, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/core/hooks/ThemedContext";
import SettingsStyles from "../src/styles/SettingsStyle";
import ClearHistoryModal from "../src/components/ClearHistoryModal";
import JobHistoryService from "../business/services/JobHistoryServices";

/**
 *
 * @returns SettingsScreen component
 * This component allows users to manage their account settings, including dark mode, logout, and clearing job history.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, setDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const jobHistoryService = new JobHistoryService();

  /**
   * State variable to manage local dark mode
   */
  const [localDarkMode, setLocalDarkMode] = useState(isDark);

  useEffect(() => {
    setDarkMode(localDarkMode);
  }, [localDarkMode]);

  useEffect(() => {
    setLocalDarkMode(isDark);
  }, [isDark]);

  //TODO: Implement the logout functionality
  const handleLogout = () => {
    console.log("Logging out...");
  };

  /**
   * Function to show the clear job history modal
   * This function sets the modalVisible state to true, triggering the modal to appear.
   */
  const showClearHistoryModal = () => {
    setModalVisible(true);
  };

  /**
   * Function to handle clearing job history
   * This function calls the job history service to clear the job history.
   */
  const handleClearJobHistory = async () => {
    try {
      // Call the service layer to clear job history
      const success = await jobHistoryService.clearJobHistory();

      if (success) {
        console.log("Job history cleared successfully");
      } else {
        console.error("Failed to clear job history");
      }
    } catch (error) {
      console.error("Error clearing job history:", error);
    } finally {
      setModalVisible(false);
    }
  };

  /**
   * Function to navigate to the preferences screen
   * This function uses the router to navigate to the preferences screen.
   */
  const goToPreferences = () => {
    router.push("/PreferencesScreen");
  };

  return (
    <View
      style={[
        SettingsStyles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
    >
      {/* Profile Image */}
      <View style={SettingsStyles.profileImageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }} //TODO: Replace with actual profile image URL
          style={SettingsStyles.profileImage}
        />
      </View>

      {/* Account Settings Header */}
      <Text style={[SettingsStyles.header, { color: theme.textColor }]}>
        Account Settings
      </Text>

      {/* Dark Mode Toggle */}
      <View
        style={[
          SettingsStyles.settingRow,
          { borderBottomColor: theme.separatorColor },
        ]}
      >
        <Text style={[SettingsStyles.settingLabel, { color: theme.textColor }]}>
          Dark mode
        </Text>
        <Switch
          value={localDarkMode}
          onValueChange={setLocalDarkMode}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={localDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity
        style={[
          SettingsStyles.button,
          { backgroundColor: theme.buttonBackgroundColor },
        ]}
        onPress={handleLogout}
      >
        <Text
          style={[SettingsStyles.buttonText, { color: theme.buttonTextColor }]}
        >
          Log Out
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          SettingsStyles.button,
          { backgroundColor: theme.buttonBackgroundColor },
        ]}
        onPress={showClearHistoryModal}
      >
        <Text
          style={[SettingsStyles.buttonText, { color: theme.buttonTextColor }]}
        >
          Clear Job History
        </Text>
      </TouchableOpacity>

      <ClearHistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleClearJobHistory}
      />

      <View style={SettingsStyles.preferencesSection}>
        <Text style={[SettingsStyles.sectionTitle, { color: theme.textColor }]}>
          Job Preferences
        </Text>
        <Text
          style={[
            SettingsStyles.sectionDescription,
            { color: theme.secondaryTextColor },
          ]}
        >
          Set preferences to assign importance to particular aspects of a job to
          better fit your needs.
        </Text>
        <TouchableOpacity
          style={[
            SettingsStyles.outlineButton,
            { borderColor: theme.outlineButtonBorderColor },
          ]}
          onPress={goToPreferences}
        >
          <Text
            style={[
              SettingsStyles.outlineButtonText,
              { color: theme.textColor },
            ]}
          >
            Go to Preferences
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
