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
    loadPreferences();
  }, []);

  /**
   * Handles navigation to the home screen
   */
  const handleHomePress = (): void => {
    //router.push("/MainMenu");
    router.back();
  };

  /**
   * Loads user preferences from the server
   * and sets the initial state for the preferences.
   */
  const loadPreferences = async () => {
    try {
      setLoading(true);
      const user = await userService.getOrCreateUser();
      setUserId(user.id);
      const userPreferences = await userService.getUserPreferences(user.id);
      setPreferences(userPreferences);
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @returns void
   * Saves the user preferences to the server.
   */
  const savePreferences = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      await userService.saveUserPreferences(userId, preferences);
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
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <View style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              marginLeft: 20,
              marginBottom: 20,
              backgroundColor: "#2196F3",
              padding: 10,
              borderRadius: 5,
              alignSelf: "center",
            }}
            onPress={handleHomePress}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Preferences</Text>
        <Text>Set how important each factor is to you (1-5)</Text>

        <PreferenceSlider
          label="Health"
          value={preferences.health}
          onChange={(value) => handlePreferenceChange("health", value)}
        />
        <PreferenceSlider
          label="Vision"
          value={preferences.vision}
          onChange={(value) => handlePreferenceChange("vision", value)}
        />
        <PreferenceSlider
          label="Vacation"
          value={preferences.vacation}
          onChange={(value) => handlePreferenceChange("vacation", value)}
        />
        <PreferenceSlider
          label="Sick"
          value={preferences.sick}
          onChange={(value) => handlePreferenceChange("sick", value)}
        />
        <PreferenceSlider
          label="Maternity"
          value={preferences.maternity}
          onChange={(value) => handlePreferenceChange("maternity", value)}
        />
        <PreferenceSlider
          label="Paternity"
          value={preferences.paternity}
          onChange={(value) => handlePreferenceChange("paternity", value)}
        />
        <PreferenceSlider
          label="Religious Leave"
          value={preferences.religiousLeave}
          onChange={(value) => handlePreferenceChange("religiousLeave", value)}
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
