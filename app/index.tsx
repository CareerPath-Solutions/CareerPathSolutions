import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../data/database/supabase';
import styles from '../src/styles/AuthStyles';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const redirectTo = makeRedirectUri();
  const url = Linking.useURL();

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  };

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/MainMenu');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (url) {
      createSessionFromUrl(url);
    }
  }, [url]);

  /**
   * This checkUser signs out the user upon login to ensure
   *  the login screen is never skipped even if the username is cached.
   */
  // async function checkUser() {
  //   try {
  //     // Sign out any existing session when the auth screen loads
  //     await supabase.auth.signOut();
  //   } catch (error) {
  //     console.error('Error checking user:', error);
  //   }
  // }

  /**
   * This checkUser function will automatically sign in
   *  the user and skip login page once signed in the first time.
   */
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
          redirectTo,
          skipBrowserRedirect: true,
        }
      });

      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
      );

      if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
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