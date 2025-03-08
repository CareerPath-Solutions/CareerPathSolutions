import React, { useState, useEffect } from "react";
import { View, Text, Image, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/core/hooks/ThemedContext";
import SettingsStyles from "../src/styles/SettingsStyle";
import ClearHistoryModal from "../src/components/ClearHistoryModal";
import JobHistoryService from "../business/services/JobHistoryService";


export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, setDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const jobHistoryService = new JobHistoryService();

  // Add local state to ensure the Switch works properly
  const [localDarkMode, setLocalDarkMode] = useState(isDark);

  // Sync the local state with the theme context
  useEffect(() => {
    setDarkMode(localDarkMode);
  }, [localDarkMode]);

  // Sync the local state when isDark changes from context
  useEffect(() => {
    setLocalDarkMode(isDark);
  }, [isDark]);

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Navigate to login screen or perform auth logout
  };

  // Show clear history confirmation modal
  const showClearHistoryModal = () => {
    setModalVisible(true);
  };

  // Handle clear job history
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

  // Navigate to preferences
  const goToPreferences = () => {
    // Navigate to preferences screen
    router.push("/PreferencesScreen");
  };

  //   // Navigate to help & FAQ
  //   const goToHelpFAQ = () => {
  //     // Navigate to help & FAQ screen
  //     router.push("/HelpFAQ");
  //   };

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
          source={{ uri: "https://via.placeholder.com/80" }} // Replace with actual user image
          style={SettingsStyles.profileImage}
        />
      </View>

      {/* Account Settings Header */}
      <Text style={[SettingsStyles.header, { color: theme.textColor }]}>
        Account Settings
      </Text>

      {/* Dark Mode Toggle - FIXED VERSION */}
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

      {/* Log Out Button */}
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

      {/* Clear Job History Button */}
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

      {/* Clear History Confirmation Modal */}
      <ClearHistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleClearJobHistory}
      />

      {/* Job Preferences Section */}
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
  );
};