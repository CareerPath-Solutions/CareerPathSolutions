import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { RatingDisplay, User } from "../core/types/user.types";
import { userService } from "../business/services/userService";
import { userRepository } from "../data/repositories/userRepository";
import styles from "../src/styles/MainPageStyles";
import authStyles from "../src/styles/AuthStyles";

/**
 *
 * @returns MainMenu component
 * This component serves as the main menu for the application, allowing users to navigate to different sections.
 */
export default function MainMenu() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousOffers, setPreviousOffers] = useState<RatingDisplay[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticatedUser =
          await userRepository.getCurrentAuthenticatedUser();

        if (authenticatedUser) {
          const dbUser = await userService.checkAuthentication(
            authenticatedUser
          );

          if (dbUser) {
            setCurrentUser(dbUser);

            const offers = await userService.getPreviousOffers(
              dbUser.user_name
            );
            setPreviousOffers(offers);
          } else {
            await userRepository.signOut();
            router.replace("/");
          }
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        await userRepository.signOut();
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    /**
     * Set up a listener for authentication state changes
     */
    const { data: authListener } = userRepository.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   *
   * @returns void
   * Handles navigation to the previous job offers screen
   */
  const handlePreviousOffers = () => {
    if (!currentUser) {
      console.log("MainMenu: No current user, not navigating");
      return;
    }

    router.push({
      pathname: "/PreviousJobOffers",
      params: { username: currentUser.user_name },
    } as any);
  };
  /**
   *
   * @returns void
   * Handles navigation to the new job offer form
   */
  const handleNewJobOffer = () => {
    if (!currentUser) {
      console.log("MainMenu: No current user, not navigating");
      return;
    }

    router.push({
      pathname: "/NewJobOfferForm",
      params: { username: currentUser.user_name },
    } as any);
  };

  const handleSignOut = async () => {
    console.log("MainMenu: Signing out");
    try {
      await userRepository.signOut();
      console.log("MainMenu: Sign out successful");
    } catch (error) {
      console.error("MainMenu: Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/LandingPageGraphic.jpeg")}
        style={styles.networkImage}
      />
      <Text style={styles.title}>CareerPath Solutions</Text>
      <Text style={styles.subtitle}>
        Welcome back, {currentUser.user_name}!
      </Text>
      <Text style={styles.subtitle}>
        Compare complete job packages and benefits that matter to you.
      </Text>

      <View style={styles.twoBtns}>
        <TouchableOpacity style={styles.button1} onPress={handleNewJobOffer}>
          <Text style={styles.buttonText1}>New Job Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePreviousOffers}>
          <Text style={styles.buttonText}>Previous Offers</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={authStyles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={authStyles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
