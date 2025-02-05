// business/services/jobOfferService.ts
import { jobOfferRepository } from '../../data/repositories/jobOfferRepository';
import { JobOfferDetails } from '../../core/types/jobOffer.types';
export const jobOfferService = {
  validateJobOffer(formData: JobOfferDetails): boolean {
    if (!formData.company_name || !formData.position || !formData.salary || !formData.description) {
      throw new Error("All fields must be filled out");
    }
    return true;
  },

  async createNewJobOffer(formData: JobOfferDetails) {
    this.validateJobOffer(formData);
    const result = await jobOfferRepository.createJobOffer(formData);
    return result;
  },

  // Add the new method for parsing offers
  parseOffers(offersJson: string | string[] | undefined): JobOfferDetails[] {
    if (!offersJson) {
      return [];
    }
    try {
      return JSON.parse(String(offersJson));
    } catch {
      return [];
    }
  }
};