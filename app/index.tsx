import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { userService } from "../business/services/userService";
import styles from "../src/styles/AuthStyles";

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * State variables for email, password, username, and authentication mode
   * isSignUp: true for sign up, false for sign in
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  /**
   * Effect to check if the user is already authenticated
   * If authenticated, redirect to the main menu
   */
  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const user = await userService.getCurrentAuthenticatedUser();
        if (user) {
          try {
            const dbUser = await userService.checkAuthentication(user);
            if (dbUser) {
              router.replace("/MainMenu");
            } else {
              await userService.signOut();
            }
          } catch (userServiceError) {
            console.error("User authentication error:", userServiceError);
            await userService.signOut();
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    handleAuthentication();

    /**
     * Set up a listener for authentication state changes
     * If the user signs in, handle authentication
     */
    const authListener = userService.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        handleAuthentication();
      }
    });

    return () => {
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  /**
   *
   * @returns void
   * Handles form submission for sign in, sign up, or password reset
   */
  async function handleSubmit() {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      if (isResetPassword) {
        // Handle password reset
        await userService.resetPassword(email);
        Alert.alert(
          "Password Reset",
          "If an account exists with this email, you will receive a password reset link"
        );
        setIsResetPassword(false);
      } else if (isSignUp) {
        if (!password) {
          Alert.alert("Error", "Please enter a password");
          setLoading(false);
          return;
        }

        if (!username) {
          Alert.alert("Error", "Please enter a username");
          setLoading(false);
          return;
        }

        await userService.signUpWithEmail(email, password, username);
        Alert.alert(
          "Account Created",
          "Your account has been created successfully. Please check your email for verification."
        );
        setIsSignUp(false);
      } else {
        if (!password) {
          Alert.alert("Error", "Please enter your password");
          setLoading(false);
          return;
        }

        await userService.signInWithEmail(email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert(
        "Error",
        (error as Error).message || "An error occurred during authentication"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

          {/* Form UI */}
          {isResetPassword ? (
            /* Password Reset Form */
            <>
              <TextInput
                style={
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }
                }
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Processing..." : "Reset Password"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton || { marginTop: 15 }}
                onPress={() => setIsResetPassword(false)}
              >
                <Text style={styles.linkText || { color: "#2563EB" }}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Sign In/Sign Up Form */
            <>
              <TextInput
                style={
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }
                }
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }
                }
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isSignUp && (
                <TextInput
                  style={
                    styles.textInput || {
                      backgroundColor: "white",
                      padding: 15,
                      borderRadius: 8,
                      marginVertical: 8,
                      width: "100%",
                      borderWidth: 1,
                      borderColor: "#ddd",
                    }
                  }
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              )}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton || { marginTop: 15 }}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setUsername("");
                }}
              >
                <Text style={styles.linkText || { color: "#2563EB" }}>
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>

              {!isSignUp && (
                <TouchableOpacity
                  style={styles.linkButton || { marginTop: 10 }}
                  onPress={() => setIsResetPassword(true)}
                >
                  <Text style={styles.linkText || { color: "#2563EB" }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
