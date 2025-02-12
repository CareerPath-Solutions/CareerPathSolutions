import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from '../data/database/supabase';
import { User } from '../core/types/user.types';
import styles from "../src/styles/MainPageStyles";
import authStyles from "../src/styles/AuthStyles";

export default function MainMenu() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.replace('/');
          return;
        }

        const { data: dbUser, error: findError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (dbUser) {
          setCurrentUser(dbUser);
        } else {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              user_name: user.user_metadata.user_name || user.email?.split('@')[0],
              auth_id: user.id
            })
            .select()
            .single();

          if (createError) {
            console.error('User creation error:', createError);
            router.replace('/');
            return;
          }

          setCurrentUser(newUser);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        router.replace('/');
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handlePreviousOffers = () => {
    if (!currentUser) {
      router.replace('/');
      return;
    }

    router.push({
      pathname: "/PreviousJobOffers",
      params: { username: currentUser.user_name }
    });
  };

  const handleNewJobOffer = () => {
    if (!currentUser) {
      router.replace('/');
      return;
    }

    router.push({
      pathname: "/NewJobOfferForm",
      params: { username: currentUser.user_name },
    });
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <TouchableOpacity
          style={styles.button1}
          onPress={handleNewJobOffer}
        >
          <Text style={styles.buttonText1}>New Job Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePreviousOffers}
        >
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