// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

// Define our route param types
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

// Make types available for other components
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}

/**
 * Root layout component for the application.
 * This component sets up a stack navigator and global layout configurations.
 * 
 * @returns The root layout component with configured stack navigation
 */
export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F0F4FF' }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Home'
          }}
        />
        <Stack.Screen 
          name="PreviousJobForm" 
          options={{
            title: 'Previous Offers'
          }}
        />
        <Stack.Screen 
          name="JobRating" 
          options={{
            title: 'Job Rating'
          }}
        />
        <Stack.Screen 
          name="NewJobOfferForm" 
          options={{
            title: 'New Job Offer'
          }}
        />
        <Stack.Screen 
          name="BenefitForm" 
          options={{
            title: 'Benefits'
          }}
        />
      </Stack>
    </>
  );
}