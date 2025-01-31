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
  }
};