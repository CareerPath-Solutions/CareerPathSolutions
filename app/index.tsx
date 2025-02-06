import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../src/styles/MainPageStyles";
import { userService } from "../business/services/userService";

export default function MainPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviousOffers = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    setIsLoading(true);
    try {
      const offers = await userService.getPreviousOffers(username);
      router.push({
        pathname: "/PreviousJobOffers",
        params: { offers: JSON.stringify(offers) }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to fetch previous offers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewJobOffer = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    setIsLoading(true);
    try {
      await userService.createNewUser(username);
      router.push({
        pathname: "/NewJobOfferForm",
        params: { username: username },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        (error as Error).message || "Failed to save username"
      );
      console.error("Error saving username:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/LandingPageGraphic.jpeg")}
        style={styles.networkImage}
      />
      <Text style={styles.title}>CareerPath Solutions</Text>
      <Text style={styles.subtitle}>
        Take control of your career decisions. Compare complete job packages and
        benefits that matter to you.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
        autoCapitalize="none"
      />
      <View style={styles.twoBtns}>
        <TouchableOpacity
          style={[styles.button1, isLoading && styles.buttonDisabled]}
          onPress={handleNewJobOffer}
          disabled={isLoading}
        >
          <Text style={styles.buttonText1}>
            {isLoading ? "SAVING..." : "New Job Offer"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handlePreviousOffers}
          disabled={isLoading}
          >
        <Text style={styles.buttonText}>Previous Offers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
