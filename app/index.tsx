// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../data/database/supabase';
import styles from '../src/styles/AuthStyles';

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/MainMenu');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  }

  async function signInWithGitHub() {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'yourapp://login-callback'
        }
      });

      if (error) throw error;
      
      // After successful authentication
      if (data) {
        router.replace('/MainMenu');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing in with GitHub');
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
        Take control of your career decisions with personalized job package analysis.
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