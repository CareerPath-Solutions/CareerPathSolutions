// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

// Define route param types
type AppParamList = {
  index: undefined;
  PreviousJobForm: { offers: string };
  JobRating: { data: string };
  NewJobOfferForm: { username: string };
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
