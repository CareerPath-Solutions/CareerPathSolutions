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
import { useTheme } from "../core/hooks/ThemedContext";
import { userService } from "../business/services/userService";
import styles from "../src/styles/AuthStyles";

export default function AuthScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  /**
   * State variables for user input
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  /**
   * Effect to check if the user is already authenticated
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
   * This function handles the form submission for sign in, sign up, or password reset.
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
      style={{ flex: 1, backgroundColor: theme.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          <Image
            source={require("../assets/images/LandingPageGraphic.jpeg")}
            style={styles.networkImage}
          />

          <Text style={[styles.title, { color: theme.textColor }]}>
            CareerPath Solutions
          </Text>

          <Text style={[styles.subtitle, { color: theme.secondaryTextColor }]}>
            Take control of your career decisions with personalized job package
            analysis.
          </Text>

          {/* Form UI */}
          {isResetPassword ? (
            /* Password Reset Form */
            <>
              <TextInput
                style={[
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  },
                  {
                    backgroundColor: isDark ? "#333" : "white",
                    color: theme.textColor,
                    borderColor: isDark ? "#444" : "#ddd",
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={isDark ? "#aaa" : "#999"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && styles.buttonDisabled,
                  { backgroundColor: theme.buttonBackgroundColor },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text
                  style={[styles.buttonText, { color: theme.buttonTextColor }]}
                >
                  {loading ? "Processing..." : "Reset Password"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton || { marginTop: 15 }}
                onPress={() => setIsResetPassword(false)}
              >
                <Text
                  style={[
                    styles.linkText || { color: "#2563EB" },
                    { color: theme.textColor },
                  ]}
                >
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Sign In/Sign Up Form */
            <>
              <TextInput
                style={[
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  },
                  {
                    backgroundColor: isDark ? "#333" : "white",
                    color: theme.textColor,
                    borderColor: isDark ? "#444" : "#ddd",
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={isDark ? "#aaa" : "#999"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                style={[
                  styles.textInput || {
                    backgroundColor: "white",
                    padding: 15,
                    borderRadius: 8,
                    marginVertical: 8,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ddd",
                  },
                  {
                    backgroundColor: isDark ? "#333" : "white",
                    color: theme.textColor,
                    borderColor: isDark ? "#444" : "#ddd",
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={isDark ? "#aaa" : "#999"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {isSignUp && (
                <TextInput
                  style={[
                    styles.textInput || {
                      backgroundColor: "white",
                      padding: 15,
                      borderRadius: 8,
                      marginVertical: 8,
                      width: "100%",
                      borderWidth: 1,
                      borderColor: "#ddd",
                    },
                    {
                      backgroundColor: isDark ? "#333" : "white",
                      color: theme.textColor,
                      borderColor: isDark ? "#444" : "#ddd",
                    },
                  ]}
                  placeholder="Username"
                  placeholderTextColor={isDark ? "#aaa" : "#999"}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              )}

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && styles.buttonDisabled,
                  { backgroundColor: theme.buttonBackgroundColor },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text
                  style={[styles.buttonText, { color: theme.buttonTextColor }]}
                >
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
                <Text
                  style={[
                    styles.linkText || { color: "#2563EB" },
                    { color: theme.textColor },
                  ]}
                >
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
                  <Text
                    style={[
                      styles.linkText || { color: "#2563EB" },
                      { color: theme.textColor },
                    ]}
                  >
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
