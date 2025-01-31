// core/types/jobOffer.types.ts
export interface JobOfferDetails {
    company_name: string;
    position: string;
    salary: string;
    description: string;
  }
  
  export interface BenefitFormParams {
    salary: string;
    position: string;
  }
  
  export interface LocalSearchParams {
    username: string;
  }
  
  export const AVAILABLE_POSITIONS = [
    "Jr. Software Engineer",
    "Jr. Data Analyst",
    "QA/Test Engineer",
    "Technical Support Engineer",
    "Jr. Frontend Developer",
    "UI/UX Designer Junior"
  ] as const;