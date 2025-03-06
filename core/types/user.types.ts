export interface User {
    id: string;
    user_name: string;
    created_at: Date;
}

export interface Rating {
    company_name: string;
    overall_grade: string;
}

export interface RatingDisplay {
    company: string;
    grade: string;
}

export interface UserPreferences {
    health: number;
    vision: number;
    vacation: number;
    sick: number;
    maternity: number;
    paternity: number;
    religiousLeave: number;
  }