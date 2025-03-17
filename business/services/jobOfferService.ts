import { jobOfferRepository } from '../../data/repositories/jobOfferRepository';
import { JobOfferDetails } from '../../core/types/jobOffer.types';

/**
 * [jobOfferService description]
 *
 * @var {[type]}
 */
export const jobOfferService = {
  validateJobOffer(formData: JobOfferDetails): boolean {
    if (!formData.company_name || !formData.position || !formData.salary || !formData.description) {
      throw new Error("All fields must be filled out");
    }
    return true;
  },

  /**
   * [createNewJobOffer description]
   *
   * @param   {JobOfferDetails}  formData  [formData description]
   *
   * @return  {<formData>}                 [return description]
   */
  async createNewJobOffer(formData: JobOfferDetails) {
    this.validateJobOffer(formData);
    const result = await jobOfferRepository.createJobOffer(formData);
    return result;
  },

  /**
   * [parseOffers description]
   *
   * @param   {string[][]}         offersJson  [offersJson description]
   *
   * @return  {JobOfferDetails[]}              [return description]
   */
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