// app/MainMenu.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from '../data/database/supabase';
import { userService } from '../business/services/userService';
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
        
        if (user) {
          const { data: dbUser, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', user.id)
            .single();
  
          if (!dbUser) {
            const createResult = await supabase
              .from('users')
              .insert({
                user_name: user.user_metadata.user_name || user.email?.split('@')[0],
                auth_id: user.id
              })
              .select()
              .single();
  
            const newUser = createResult.data;
            const createError = createResult.error;
  
            if (createError) {
              console.error('User creation error:', createError);
              router.replace('/');
              return;
            }
  
            setCurrentUser(newUser);
          } else {
            setCurrentUser(dbUser);
          }
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        router.replace('/');
      }
    };
  
    checkAuth();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          router.replace('/MainMenu');
        }
      }
    );
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  // useEffect(() => {
  //   async function loadUser() {
  //     try {
  //       const user = await userService.getOrCreateUser();
  //       setCurrentUser(user);
  //     } catch (error) {
  //       console.error('Error loading user:', error);
  //       router.replace('/');
  //     }
  //   }
  //   loadUser();
  // }, []);

  const handlePreviousOffers = async () => {
    try {
      if (!currentUser) {
        router.replace('/');
        return;
      }

      router.push({
        pathname: "/PreviousJobOffers",
        params: { username: currentUser.user_name }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewJobOffer = async () => {
    try {
      if (!currentUser) {
        router.replace('/');
        return;
      }

      router.push({
        pathname: "/NewJobOfferForm",
        params: { username: currentUser.user_name },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/LandingPageGraphic.jpeg")}
        style={styles.networkImage}
      />
      <Text style={styles.title}>CareerPath Solutions</Text>
      {currentUser && (
        <Text style={styles.subtitle}>
          Welcome back, {currentUser.user_name}!
        </Text>
      )}
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


// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { supabase } from '../data/database/supabase';
// import styles from "../src/styles/MainPageStyles";
// import authStyles from "../src/styles/AuthStyles";

// export default function MainMenu() {
//   const router = useRouter();

//   const handlePreviousOffers = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         router.replace('/');
//         return;
//       }
      
//       const { data: userProfile } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       router.push({
//         pathname: "/PreviousJobOffers",
//         params: { username: userProfile.user_name }
//       });
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleNewJobOffer = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         router.replace('/');
//         return;
//       }

//       router.push({
//         pathname: "/NewJobOfferForm",
//         params: { username: user.email },
//       });
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       router.replace('/');
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/LandingPageGraphic.jpeg")}
//         style={styles.networkImage}
//       />
//       <Text style={styles.title}>CareerPath Solutions</Text>
//       <Text style={styles.subtitle}>
//         Compare complete job packages and benefits that matter to you.
//       </Text>

//       <View style={styles.twoBtns}>
//         <TouchableOpacity
//           style={styles.button1}
//           onPress={handleNewJobOffer}
//         >
//           <Text style={styles.buttonText1}>New Job Offer</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handlePreviousOffers}
//         >
//           <Text style={styles.buttonText}>Previous Offers</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={authStyles.signOutButton}
//         onPress={handleSignOut}
//       >
//         <Text style={authStyles.signOutButtonText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }




// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import styles from "../src/styles/MainPageStyles";
// import { userService } from "../business/services/userService";

// export default function MainPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handlePreviousOffers = async () => {
//     console.log("Previous offers button pressed");
//     console.log("Username:", username);

//     if (!username.trim()) {
//       console.log("Username empty, showing alert");
//       Alert.alert("Error", "Please enter a username");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const offers = await userService.getPreviousOffers(username);
//       router.push({
//         pathname: "/PreviousJobOffers",
//         params: { offers: JSON.stringify(offers) }
//       });
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch previous offers");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNewJobOffer = async () => {
//     if (!username.trim()) {
//       Alert.alert("Error", "Please enter a username");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await userService.createNewUser(username);
//       router.push({
//         pathname: "/NewJobOfferForm",
//         params: { username: username },
//       });
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         (error as Error).message || "Failed to save username"
//       );
//       console.error("Error saving username:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/images/LandingPageGraphic.jpeg")}
//         style={styles.networkImage}
//       />
//       <Text style={styles.title}>CareerPath Solutions</Text>
//       <Text style={styles.subtitle}>
//         Take control of your career decisions. Compare complete job packages and
//         benefits that matter to you.
//       </Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter username"
//         value={username}
//         onChangeText={setUsername}
//         editable={!isLoading}
//         autoCapitalize="none"
//       />
//       <View style={styles.twoBtns}>
//         <TouchableOpacity
//           style={[styles.button1, isLoading && styles.buttonDisabled]}
//           onPress={handleNewJobOffer}
//           disabled={isLoading}
//         >
//           <Text style={styles.buttonText1}>
//             {isLoading ? "Loading" : "New Job Offer"}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, isLoading && styles.buttonDisabled]}
//           onPress={handlePreviousOffers}
//           disabled={isLoading}
//           >
//         <Text style={styles.buttonText}>
//             {isLoading ? "Username" : "Previous Offers"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
