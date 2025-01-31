/**
 * Grade calculation utilities and functions
 */

// Basic grade conversion
export const letterToNumber = (grade: string): number => {
    switch (grade) {
      case 'A': return 4.0;
      case 'B': return 3.0;
      case 'C': return 2.0;
      case 'D': return 1.0;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };
  
  export const numberToLetter = (number: number): string => {
    if (number >= 3.5) return 'A';
    if (number >= 2.5) return 'B';
    if (number >= 1.5) return 'C';
    if (number >= 0.5) return 'D';
    return 'F';
  };
  
  export const calculateGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 80) return 'A';
    if (percentage >= 60) return 'B';
    if (percentage >= 40) return 'C';
    if (percentage >= 20) return 'D';
    return 'F';
  };
  
  export const calculateBenefitsGrade = (selections: any): string => {
    const benefitFields = ['health_care', 'vision', 'stock_options', 'retirement_401k'];
    const trueCount = benefitFields.filter(field => selections[field]).length;
    const percentage = (trueCount / benefitFields.length) * 100;
    return calculateGradeFromPercentage(percentage);
  };
  
  export const calculateTimeOffGrade = (selections: any): string => {
    const timeOffFields = ['vacation_time', 'sick_time', 'maternity_leave', 'paternity_leave', 'religious_leave'];
    const trueCount = timeOffFields.filter(field => selections[field]).length;
    const percentage = (trueCount / timeOffFields.length) * 100;
    return calculateGradeFromPercentage(percentage);
  };
  
  export const calculateSalaryGrade = (offered: number | string, median: number): string => {
    const offeredNumber = typeof offered === 'string' ? parseFloat(offered) : offered;
    
    if (isNaN(offeredNumber)) {
      return 'F';
    }
  
    const percentageDifference = ((offeredNumber - median) / median) * 100;
    const MAX_PERCENTAGE = 20;
    const cappedDifference = Math.max(Math.min(percentageDifference, MAX_PERCENTAGE), -MAX_PERCENTAGE);
    const rating = 5 + (cappedDifference / MAX_PERCENTAGE) * 4;
    return calculateGradeFromPercentage((rating / 10) * 100);
  };
  
  export const calculateOverallGrade = (benefitsGrade: string, timeOffGrade: string, salaryGrade: string): string => {
    const benefitsNumber = letterToNumber(benefitsGrade);
    const timeOffNumber = letterToNumber(timeOffGrade);
    const salaryNumber = letterToNumber(salaryGrade);
  
    const average = (benefitsNumber + timeOffNumber + salaryNumber) / 3;
    return numberToLetter(average);
  };