// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

// Define route param types
type AppParamList = {
  index: undefined;
  //TODO add one for MainMenu screen because it loads with the username string
  PreviousJobForm: { offers: string };
  JobRating: { data: string };
  NewJobOfferForm: { username: string };
  MainMenu: { username: string };
  BenefitForm: {
    company_name: string;
    username: string;
    salary: number;
    position: string;
  };
};

// Make types available globally
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}

/**
 * Root layout component for the application.
 * Sets up stack navigation and global layout configurations.
 */
export default function Layout() {
  useEffect(() => {
    async function prepare() {
      try {
        // Add any initialization logic here
        // For example, loading fonts, making API calls, etc.
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate loading time
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F0F4FF" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Authentication",
          }}
        />
        <Stack.Screen
          name="MainMenu"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="PreviousJobOffers"
          options={{
            title: "Previous Offers",
          }}
        />
        <Stack.Screen
          name="JobRating"
          options={{
            title: "Job Rating",
          }}
        />
        <Stack.Screen
          name="NewJobOfferForm"
          options={{
            title: "New Job Offer",
          }}
        />
        <Stack.Screen
          name="BenefitForm"
          options={{
            title: "Benefits",
          }}
        />
      </Stack>
    </>
  );
}
