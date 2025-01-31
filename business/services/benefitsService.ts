// business/services/benefitsService.ts
import { BenefitSelections } from '../../core/types/benefits.types';
import { jobOfferRepository } from '../../../data/repositories/jobOfferRepository';
import {
    calculateBenefitsGrade,
    calculateTimeOffGrade,
    calculateSalaryGrade,
    calculateOverallGrade
} from '../calculators/gradeCalculator';

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
        selections: BenefitSelections
    ): Promise<JobGrades> {
        try {
            // Create user
            const userData = await jobOfferRepository.createUser(username);

            // Get and update latest job offer
            const latestJob = await jobOfferRepository.getLatestJobOffer();
            await jobOfferRepository.updateJobOffer(latestJob.id, selections);

            // Get median salary for comparison
            const medianData = await jobOfferRepository.getMedianSalary(position);

            // Calculate grades
            const benefitsGrade = calculateBenefitsGrade(selections);
            const timeOffGrade = calculateTimeOffGrade(selections);
            const salaryGrade = calculateSalaryGrade(offeredSalary, medianData.median_salary);
            const overallGrade = calculateOverallGrade(benefitsGrade, timeOffGrade, salaryGrade);

            // Save rating
            await jobOfferRepository.saveRating({
                company_name: companyName,
                benefits: benefitsGrade,
                time_off: timeOffGrade,
                salary: salaryGrade,
                overall_grade: overallGrade,
                user_id: userData.id
            });

            return {
                benefits: benefitsGrade,
                timeOff: timeOffGrade,
                salary: salaryGrade,
                overall: overallGrade
            };
        } catch (error) {
            console.error('Error in submitBenefits:', error);
            throw error;
        }
    }
};