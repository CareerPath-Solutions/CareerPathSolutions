// app/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../data/database/supabase';
import styles from '../src/styles/AuthStyles';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const redirectTo = makeRedirectUri();

  // Handle linking into app from email app
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
    if (url) {
      createSessionFromUrl(url);
    }
  }, [url]);

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

//-------------------------------------------------------------


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { supabase } from '../data/database/supabase';
// import styles from '../src/styles/AuthStyles';
// import * as WebBrowser from 'expo-web-browser';

// export default function AuthScreen() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const checkInitialUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) router.replace('/MainMenu');
//     };
//     checkInitialUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         if (session?.user) {
//           router.replace('/MainMenu');
//         }
//       }
//     );

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);
  
// async function signInWithGitHub() {
//   try {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'github',
//       options: {
//         redirectTo: 'exp://10.0.0.9:8081'
//       }
//     });

//     console.log('OAuth initiation data:', data);
//     console.log('OAuth initiation error:', error);

//     if (data?.url) {
//       const result = await WebBrowser.openAuthSessionAsync(
//         data.url, 
//         'exp://10.0.0.9:8081'
//       );

//       console.log('WebBrowser result:', result);

//       if (result.type === 'success') {
//         // Force a session refresh
//         await supabase.auth.refreshSession();
//       }
//     }

//     if (error) throw error;
//   } catch (error) {
//     console.error('Complete Sign-in Error:', error);
//     alert('Error signing in with GitHub');
//   }
// }




//-----------------------------------------------------------------



  // async function signInWithGitHub() {
  //   try {
  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: 'github',
  //       options: {
  //         redirectTo: 'exp://10.0.0.9:8081',
  //         skipBrowserRedirect: false
  //       }
  //     });
  
  //     if (data?.url) {
  //       const result = await WebBrowser.openAuthSessionAsync(
  //         data.url, 
  //         'exp://10.0.0.9:8081'
  //       );
  
  //       if (result.type === 'success') {
  //         // Attempt to get the session
  //         const { data: { session }, error: sessionError } = 
  //           await supabase.auth.getSession();
  
  //         if (sessionError) {
  //           console.error('Session retrieval error:', sessionError);
  //           return;
  //         }
  
  //         // Redirect to MainMenu
  //         router.replace('/MainMenu');
  //       }
  //     }
  
  //     if (error) {
  //       console.error('OAuth Error:', error);
  //     }
  //   } catch (error) {
  //     console.error('Sign-in error:', error);
  //   }
  // }

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/LandingPageGraphic.jpeg")}
//         style={styles.networkImage}
//       />
//       <Text style={styles.title}>CareerPath Solutions</Text>
//       <Text style={styles.subtitle}>
//         Take control of your career decisions with personalized job package analysis.
//       </Text>

//       <TouchableOpacity 
//         style={[styles.githubButton, loading && styles.buttonDisabled]}
//         onPress={signInWithGitHub}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Signing in..." : "Sign in with GitHub"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { supabase } from '../data/database/supabase';
// import styles from '../src/styles/AuthStyles';

// export default function AuthScreen() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   async function checkUser() {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       console.log('Checking user:', user);
//       if (user) {
//         console.log('Authenticated user found, redirecting to MainMenu');
//         router.replace('/MainMenu');
//       }
//     } catch (error) {
//       console.error('Error checking user:', error);
//     }
//   }

//   async function signInWithGitHub() {
//     try {
//       setLoading(true);
//       console.log('Initiating GitHub OAuth');
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'github',
//         options: {
//           redirectTo: 'exp://10.0.0.9:8081'
//         }
//       });
  
//       console.log('OAuth response data:', data);
//       if (error) {
//         console.error('OAuth Error:', error);
//         throw error;
//       }
      
//       if (data) {
//         console.log('Successful authentication, redirecting to MainMenu');
//         router.replace('/MainMenu');
//       }
//     } catch (error) {
//       console.error('Complete Sign-in Error:', error);
//       alert('Error signing in with GitHub');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/LandingPageGraphic.jpeg")}
//         style={styles.networkImage}
//       />
//       <Text style={styles.title}>CareerPath Solutions</Text>
//       <Text style={styles.subtitle}>
//         Take control of your career decisions with personalized job package analysis.
//       </Text>

//       <TouchableOpacity 
//         style={[styles.githubButton, loading && styles.buttonDisabled]}
//         onPress={signInWithGitHub}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Signing in..." : "Sign in with GitHub"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }