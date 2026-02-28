/**
 * Grade calculation utilities with preference weighting
 */

export const letterToNumber = (grade: string): number => {
  switch (grade) {
    case "A":
      return 4.0;
    case "B":
      return 3.0;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    case "F":
      return 0.0;
    default:
      return 0.0;
  }
};

export const numberToLetter = (number: number): string => {
  if (number >= 3.5) return "A";
  if (number >= 2.5) return "B";
  if (number >= 1.5) return "C";
  if (number >= 0.5) return "D";
  return "F";
};

export const calculateGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 80) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 40) return "C";
  if (percentage >= 20) return "D";
  return "F";
};

export const calculateBenefitsGrade = (
  selections: any,
  preferences: any,
): string => {
  const benefitFields = [
    { key: "health_care", prefKey: "health" },
    { key: "vision", prefKey: "vision" },
    { key: "stock_options", prefKey: "stock_options" },
    { key: "retirement_401k", prefKey: "retirement" },
  ];

  let weightedScore = 0;
  let totalWeight = 0;

  benefitFields.forEach(({ key, prefKey }) => {
    const weight = preferences?.[prefKey] ?? 3;
    totalWeight += weight;
    if (selections[key]) {
      weightedScore += weight;
    }
  });

  if (totalWeight === 0) return "F";
  const percentage = (weightedScore / totalWeight) * 100;
  return calculateGradeFromPercentage(percentage);
};

export const calculateTimeOffGrade = (
  selections: any,
  preferences: any,
): string => {
  const timeOffFields = [
    { key: "vacation_time", prefKey: "vacation" },
    { key: "sick_time", prefKey: "sick" },
    { key: "maternity_leave", prefKey: "maternity" },
    { key: "paternity_leave", prefKey: "paternity" },
    { key: "religious_leave", prefKey: "religious_leave" },
  ];

  let weightedScore = 0;
  let totalWeight = 0;

  timeOffFields.forEach(({ key, prefKey }) => {
    const weight = preferences?.[prefKey] ?? 3;
    totalWeight += weight;
    if (selections[key]) {
      weightedScore += weight;
    }
  });

  if (totalWeight === 0) return "F";
  const percentage = (weightedScore / totalWeight) * 100;
  return calculateGradeFromPercentage(percentage);
};

export const calculateSalaryGrade = (
  offered: number | string,
  median: number,
): string => {
  const offeredNumber =
    typeof offered === "string" ? parseFloat(offered) : offered;

  if (isNaN(offeredNumber)) return "F";

  const percentageDifference = ((offeredNumber - median) / median) * 100;
  const MAX_PERCENTAGE = 20;
  const cappedDifference = Math.max(
    Math.min(percentageDifference, MAX_PERCENTAGE),
    -MAX_PERCENTAGE,
  );
  const rating = 5 + (cappedDifference / MAX_PERCENTAGE) * 4;
  return calculateGradeFromPercentage((rating / 10) * 100);
};

export const calculateOverallGrade = (
  benefitsGrade: string,
  timeOffGrade: string,
  salaryGrade: string,
  preferences?: any,
): string => {
  const benefitsNumber = letterToNumber(benefitsGrade);
  const timeOffNumber = letterToNumber(timeOffGrade);
  const salaryNumber = letterToNumber(salaryGrade);
  const average = (benefitsNumber + timeOffNumber + salaryNumber) / 3;
  return numberToLetter(average);
};
