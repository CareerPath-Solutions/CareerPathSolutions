import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { userService } from "../business/services/userService";
import styles from "../src/styles/AuthStyles";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const url = Linking.useURL();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const user = await userService.getCurrentAuthenticatedUser();
        if (user) {
          try {
            const dbUser = await userService.getOrCreateGitHubUser(user);
            if (dbUser) {
              router.replace("MainMenu");
            } else {
              await userService.signOut();
            }
          } catch (userServiceError) {
            console.error("GitHub user creation error:", userServiceError);
            await userService.signOut();
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    // Initial check
    handleAuthentication();

    // Auth state change listener
    const authListener = userService.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        handleAuthentication();
      }
    });

    return () => {
      authListener;
    };
  }, []);

  // URL-based authentication effect
  useEffect(() => {
    const handleUrlBasedAuth = async () => {
      if (url) {
        try {
          const user = await userService.createSessionFromUrl(url);
          if (user) {
            router.replace("MainMenu");
          }
        } catch (error) {
          console.error("URL auth error:", error);
        }
      }
    };
    
    handleUrlBasedAuth();
  }, [url]);

  async function signInWithGitHub() {
    try {
      setLoading(true);
      await userService.signInWithGitHub('');
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      alert("Error signing in with GitHub");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/LandingPageGraphic.jpeg")}
        style={styles.networkImage}
      />
      <Text style={styles.title}>CareerPath Solutions</Text>
      <Text style={styles.subtitle}>
        Take control of your career decisions with personalized job package
        analysis.
      </Text>
      <TouchableOpacity
        style={[styles.githubButton, loading && styles.buttonDisabled]}
        onPress={signInWithGitHub}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing in..." : "Sign in with GitHub"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}