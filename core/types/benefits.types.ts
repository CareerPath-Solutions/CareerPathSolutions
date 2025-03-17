/**
 * [CheckboxProps description]
 */
export interface CheckboxProps {
    label: string;
    checked: boolean;
    onPress: () => void;
  }
  
  /**
   * [BenefitSelections description]
   */
  export interface BenefitSelections {
    health_care: boolean;
    vision: boolean;
    vacation_time: boolean;
    sick_time: boolean;
    maternity_leave: boolean;
    paternity_leave: boolean;
    religious_leave: boolean;
    stock_options: boolean;
    retirement_401k: boolean;
  }