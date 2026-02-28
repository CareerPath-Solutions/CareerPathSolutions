import { BenefitSelections } from "../../core/types/benefits.types";
import { jobOfferRepository } from "../../data/repositories/jobOfferRepository";
import { userPreferencesRepository } from "../../data/repositories/userPreferencesRepository";
import {
  calculateBenefitsGrade,
  calculateTimeOffGrade,
  calculateSalaryGrade,
  calculateOverallGrade,
} from "../calculators/gradeCalculator";

interface JobGrades {
  benefits: string;
  timeOff: string;
  salary: string;
  overall: string;
}

export const benefitsService = {
  async submitBenefits(
    username: string,
    companyName: string,
    position: string,
    offeredSalary: number,
    selections: BenefitSelections,
  ): Promise<JobGrades> {
    try {
      // Get or create the current user
      const userData = await jobOfferRepository.getOrCreateUser();

      // Get latest job offer for this user
      const latestJob = await jobOfferRepository.getLatestJobOffer();

      // Update job offer with benefit selections
      await jobOfferRepository.updateJobOffer(latestJob.id, selections);

      // Get user's preference weights
      const preferences =
        await userPreferencesRepository.getOrCreatePreferences(userData.id);

      // Get median salary for comparison
      const medianData = await jobOfferRepository.getMedianSalary(position);

      // Calculate grades using preference weights
      const benefitsGrade = calculateBenefitsGrade(selections, preferences);
      const timeOffGrade = calculateTimeOffGrade(selections, preferences);
      const salaryGrade = calculateSalaryGrade(
        offeredSalary,
        medianData.median_salary,
      );
      const overallGrade = calculateOverallGrade(
        benefitsGrade,
        timeOffGrade,
        salaryGrade,
        preferences,
      );

      // Save rating with job offer link
      await jobOfferRepository.saveRating({
        company_name: companyName,
        benefits: benefitsGrade,
        time_off: timeOffGrade,
        salary: salaryGrade,
        overall_grade: overallGrade,
        user_id: userData.id,
        job_offer_id: latestJob.id,
      });

      return {
        benefits: benefitsGrade,
        timeOff: timeOffGrade,
        salary: salaryGrade,
        overall: overallGrade,
      };
    } catch (error) {
      console.error("Error in submitBenefits:", error);
      throw error;
    }
  },
};
