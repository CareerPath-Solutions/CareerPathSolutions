/**
 * [letterToNumber description]
 *
 * @param   {string}  grade  [grade description]
 *
 * @return  {number}         [return description]
 */
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
/**
 * [numberToLetter description]
 *
 * @return  {string}  [return description]
 */
export const numberToLetter = (number: number): string => {
  if (number >= 3.5) return 'A';
  if (number >= 2.5) return 'B';
  if (number >= 1.5) return 'C';
  if (number >= 0.5) return 'D';
  return 'F';
};
/**
 * [calculateGradeFromPercentage description]
 *
 * @param   {number}  percentage  [percentage description]
 *
 * @return  {string}              [return description]
 */
export const calculateGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 80) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 40) return 'C';
  if (percentage >= 20) return 'D';
  return 'F';
};
/**
 * [calculateBenefitsGrade description]
 *
 * @param   {any}     selections  [selections description]
 *
 * @return  {string}              [return description]
 */
export const calculateBenefitsGrade = (selections: any): string => {
  const benefitFields = ['health_care', 'vision', 'stock_options', 'retirement_401k'];
  const trueCount = benefitFields.filter(field => selections[field]).length;
  const percentage = (trueCount / benefitFields.length) * 100;
  return calculateGradeFromPercentage(percentage);
};
/**
 * [calculateTimeOffGrade description]
 *
 * @param   {any}     selections  [selections description]
 *
 * @return  {string}              [return description]
 */
export const calculateTimeOffGrade = (selections: any): string => {
  const timeOffFields = ['vacation_time', 'sick_time', 'maternity_leave', 'paternity_leave', 'religious_leave'];
  const trueCount = timeOffFields.filter(field => selections[field]).length;
  const percentage = (trueCount / timeOffFields.length) * 100;
  return calculateGradeFromPercentage(percentage);
};
/**
 * [calculateSalaryGrade description]
 *
 * @param   {number}  offered  [offered description]
 * @param   {number}  median   [median description]
 *
 * @return  {string}           [return description]
 */
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
/**
 * [calculateOverallGrade description]
 *
 * @param   {string}  benefitsGrade  [benefitsGrade description]
 * @param   {string}  timeOffGrade   [timeOffGrade description]
 * @param   {string}  salaryGrade    [salaryGrade description]
 *
 * @return  {string}                 [return description]
 */
export const calculateOverallGrade = (benefitsGrade: string, timeOffGrade: string, salaryGrade: string): string => {
  const benefitsNumber = letterToNumber(benefitsGrade);
  const timeOffNumber = letterToNumber(timeOffGrade);
  const salaryNumber = letterToNumber(salaryGrade);

  const average = (benefitsNumber + timeOffNumber + salaryNumber) / 3;
  return numberToLetter(average);

};

/**
 * [calculateWeightedBenefitsGrade description]
 *
 * @param   {any}     selections   [selections description]
 * @param   {any}     preferences  [preferences description]
 *
 * @return  {string}               [return description]
 */
export const calculateWeightedBenefitsGrade = (selections: any, preferences: any): string => {
const benefitFields = [
  { field: 'health_care', weight: preferences.health },
  { field: 'vision', weight: preferences.vision },
  { field: 'stock_options', weight: 3 },
  { field: 'retirement_401k', weight: 3 },
];

let totalWeight = 0;
let weightedScore = 0;

benefitFields.forEach(item => {
  totalWeight += item.weight;
  if (selections[item.field]) {
    weightedScore += item.weight;
  }
});


if (totalWeight === 0) return 'F';

const percentage = (weightedScore / totalWeight) * 100;
return calculateGradeFromPercentage(percentage);
};

/**
 * [calculateWeightedTimeOffGrade description]
 *
 * @param   {any}     selections   [selections description]
 * @param   {any}     preferences  [preferences description]
 *
 * @return  {string}               [return description]
 */
export const calculateWeightedTimeOffGrade = (selections: any, preferences: any): string => {
  const timeOffFields = [
    { field: 'vacation_time', weight: preferences.vacation },
    { field: 'sick_time', weight: preferences.sick },
    { field: 'maternity_leave', weight: preferences.maternity },
    { field: 'paternity_leave', weight: preferences.paternity },
    { field: 'religious_leave', weight: preferences.religiousLeave },
  ];
  
  let totalPossiblePoints = 0;
  let earnedPoints = 0;
  
  timeOffFields.forEach(item => {
    // Calculate maximum possible points for this field
    const maxPointsForField = item.weight * 5; // Assuming weight is on a 1-5 scale
    totalPossiblePoints += maxPointsForField;
    
    // If benefit exists, add points based on user's preference weight
    if (selections[item.field]) {
      earnedPoints += maxPointsForField;
    }
    // If benefit doesn't exist but is important to user, subtract points
    // The more important it is, the more points are lost
    else if (item.weight > 0) {
      // Don't subtract points here since we're not adding them in the first place
      // The absence of points already represents the penalty
    }
  });
  
  if (totalPossiblePoints === 0) return 'F';
  
  const percentage = (earnedPoints / totalPossiblePoints) * 100;
  return calculateGradeFromPercentage(percentage);
};

/**
* [calculateWeightedOverallGrade description]
*
* @return  {[type]}  [return description]
*/
export const calculateWeightedOverallGrade = (
benefitsGrade: string, 
timeOffGrade: string, 
salaryGrade: string, 
preferences: any
): string => {

const benefitsWeight = (preferences.health + preferences.vision) / 2;
const timeOffWeight = (
  preferences.vacation + 
  preferences.sick + 
  preferences.maternity + 
  preferences.paternity + 
  preferences.religiousLeave
) / 5;


const salaryWeight = 3;


const benefitsNumber = letterToNumber(benefitsGrade);
const timeOffNumber = letterToNumber(timeOffGrade);
const salaryNumber = letterToNumber(salaryGrade);


const totalWeight = benefitsWeight + timeOffWeight + salaryWeight;
const weightedAverage = (
  (benefitsNumber * benefitsWeight) + 
  (timeOffNumber * timeOffWeight) + 
  (salaryNumber * salaryWeight)
) / totalWeight;

return numberToLetter(weightedAverage);
};