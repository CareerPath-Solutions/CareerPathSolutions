// src/screens/PreviousJobOffersScreen.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { PreviousJobOffers } from "../components/PreviousJobOffers";
import { jobOfferService } from "../../business/services/jobOfferService";

export default function PreviousJobOffersScreen() {
  const params = useLocalSearchParams();
  const offers = jobOfferService.parseOffers(params.offers);

  return <PreviousJobOffers offers={offers} />;
}
