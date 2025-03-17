import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import PreferenceSlider from "../src/components/PreferencesSlider";
import { styles } from "../src/styles/PreferencesScreenStyles";
import { userService } from "../business/services/userService";
import styles1 from "../src/styles/JobRatingStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../core/hooks/ThemedContext";

/**
 * Interface for the preferences
 */
interface Preferences {
  health: number;
  vision: number;
  vacation: number;
  sick: number;
  maternity: number;
  paternity: number;
  religiousLeave: number;
}

/**
 *
 * @returns PreferencesScreen component
 * This component allows users to set their preferences for various benefits.
 */
const PreferencesScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  //const passedUserId = params.userId as string;

  console.log("[LIFECYCLE] PreferencesScreen component initialized");

  /**
   * State variables
   */
  const [preferences, setPreferences] = useState<Preferences>({
    health: 3,
    vision: 3,
    vacation: 3,
    sick: 3,
    maternity: 3,
    paternity: 3,
    religiousLeave: 3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("[DEBUGGING] PreferencesScreen mounting/re-mounting");
    loadPreferences();
  }, [router]); // Adding router as a dependency

  /**
   * Handles navigation to the home screen
   */
  const handleHomePress = (): void => {
    router.push("/MainMenu");
  };

  /**
   * Loads user preferences from the server
   */
  const loadPreferences = async () => {
    console.log("[LIFECYCLE] loadPreferences called");
    try {
      console.log("[PreferencesScreen] Starting to load preferences");
      setLoading(true);

      const user = await userService.getOrCreateUser();
      console.log("[PreferencesScreen] User retrieved:", user.id);
      setUserId(user.id);

      console.log(
        "[PreferencesScreen] Fetching preferences for user:",
        user.id
      );
      const userPreferences = await userService.getUserPreferences(user.id);
      console.log("[PreferencesScreen] Preferences received:", userPreferences);
      console.log("[LIFECYCLE] Setting preferences:", userPreferences);

      setPreferences(userPreferences);
    } catch (error) {
      console.error("[PreferencesScreen] Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @returns void
   */
  const savePreferences = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      await userService.saveUserPreferences(userId, preferences);
      console.log("[LIFECYCLE] Successfully saved preferences:", preferences); // Moved here
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /**
   *
   * @param preference
   * @param value
   */
  const handlePreferenceChange = (
    preference: keyof Preferences,
    value: number
  ): void => {
    setPreferences((prev) => ({
      ...prev,
      [preference]: value,
    }));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.backgroundColor }]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <View style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              marginLeft: 20,
              marginBottom: 20,
              backgroundColor: theme.buttonBackgroundColor,
              padding: 10,
              borderRadius: 5,
              alignSelf: "center",
            }}
            onPress={handleHomePress}
          >
            <Text style={{ color: theme.buttonTextColor, fontWeight: "bold" }}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.title, { color: theme.textColor }]}>
          Preferences
        </Text>
        <Text style={{ color: theme.secondaryTextColor }}>
          Set how important each factor is to you (1-5)
        </Text>

        <PreferenceSlider
          label="Health"
          value={preferences.health}
          onChange={(value) => handlePreferenceChange("health", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Vision"
          value={preferences.vision}
          onChange={(value) => handlePreferenceChange("vision", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Vacation"
          value={preferences.vacation}
          onChange={(value) => handlePreferenceChange("vacation", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Sick"
          value={preferences.sick}
          onChange={(value) => handlePreferenceChange("sick", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Maternity"
          value={preferences.maternity}
          onChange={(value) => handlePreferenceChange("maternity", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Paternity"
          value={preferences.paternity}
          onChange={(value) => handlePreferenceChange("paternity", value)}
          theme={theme}
        />
        <PreferenceSlider
          label="Religious Leave"
          value={preferences.religiousLeave}
          onChange={(value) => handlePreferenceChange("religiousLeave", value)}
          theme={theme}
        />

        <Button
          title={saving ? "Saving..." : "Save Preferences"}
          onPress={savePreferences}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
};

export default PreferencesScreen;
