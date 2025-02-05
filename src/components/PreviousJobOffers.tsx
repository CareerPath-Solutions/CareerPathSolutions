// src/components/PreviousJobOffers.tsx
import React from "react";
import { ScrollView, Text, Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles/PreviousJobOffersStyle";
import { JobOfferDetails } from "../../core/types/jobOffer.types";

interface PreviousJobOffersProps {
  offers: JobOfferDetails[];
}

export function PreviousJobOffers({ offers }: PreviousJobOffersProps) {
  const router = useRouter();

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
      {offers.length > 0 ? (
        offers.map((offer, index) => (
          <View key={index} style={styles.gradeContainer}>
            <Text style={styles.label}>{offer.company_name}</Text>
            {/* <Text style={styles.grade}>{offer.grade}</Text> */} //TODO - Add
            grade to JobOfferDetails
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
