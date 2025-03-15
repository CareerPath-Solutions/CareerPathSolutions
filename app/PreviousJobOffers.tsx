import { ScrollView, Text, Image, TouchableOpacity, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import styles from "../src/styles/PreviousJobOffersStyle";
import { RatingDisplay } from "../core/types/user.types";
import { userService } from "../business/services/userService";

export default function PreviousJobOffers() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [ratings, setRatings] = useState<RatingDisplay[]>([]);
  const username = params.username as string;

  useEffect(() => {
    async function fetchRatings() {
      try {
        const userRatings = await userService.getPreviousOffers(username);
        setRatings(userRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
    fetchRatings();
  }, [username]);

  const handleHomePress = () => {
    router.push("/");
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.homeBtn} onPress={handleHomePress}>
          <Image
            source={require("../assets/images/HomeSymbol.png")}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Previous Job Offers</Text>
      </View>
      {ratings.length > 0 ? (
        ratings.map((rating, index) => (
          <View key={index} style={styles.gradeContainer}>
            <Text style={styles.label}>{rating.company}</Text>
            <Text style={styles.grade}>{rating.grade}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noOffersText}>
          No previous job offers found for this username
        </Text>
      )}
    </ScrollView>
  );
}
// import React from "react";
// import { ScrollView, Text, Image, TouchableOpacity, View } from "react-native";
// import { useRouter } from "expo-router";
// import styles from "../src/styles/PreviousJobOffersStyle";
// import { JobOfferDetails } from "../core/types/jobOffer.types";

// interface PreviousJobOffersProps {
//   offers: JobOfferDetails[];
// }

// export default function PreviousJobOffers({ offers }: PreviousJobOffersProps) {
//   const router = useRouter();

//   const handleHomePress = () => {
//     router.push("/");
//   };

//   return (
//     <ScrollView
//       style={styles.scrollView}
//       contentContainerStyle={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.homeBtn} onPress={handleHomePress}>
//           <Image
//             source={require("../assets/images/HomeSymbol.png")}
//             style={styles.homeIcon}
//           />
//         </TouchableOpacity>
//         <Text style={styles.heading}>Previous Job Offers</Text>
//       </View>
//       {offers.length > 0 ? (
//         offers.map((offer, index) => (
//           <View key={index} style={styles.gradeContainer}>
//             <Text style={styles.label}>{offer.company_name}</Text>
//             {/* <Text style={styles.grade}>{offer.grade}</Text> */} //TODO - Add
//             grade to JobOfferDetails
//           </View>
//         ))
//       ) : (
//         <Text style={styles.noOffersText}>
//           No previous job offers found for this username
//         </Text>
//       )}
//     </ScrollView>
//   );
// }
