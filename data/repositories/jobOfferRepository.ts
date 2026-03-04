import { supabase } from "../database/supabase";
import { JobOfferDetails } from "../../core/types/jobOffer.types";

export const jobOfferRepository = {
  // Get or create the current authenticated user in our users table
  getOrCreateUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (existingUser) return existingUser;

    // Create new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          auth_id: user.id,
          user_name:
            user.user_metadata?.user_name ||
            user.email?.split("@")[0] ||
            `user_${user.id.slice(0, 8)}`,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return newUser;
  },

  // Create a job offer linked to the current user
  createJobOffer: async (formData: JobOfferDetails) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Get our internal user record
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("job_offer")
      .insert([
        {
          ...formData,
          user_id: dbUser.id,
          salary: Number(formData.salary),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get the most recent job offer for the current user
  getLatestJobOffer: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("job_offer")
      .select()
      .eq("user_id", dbUser.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a job offer with benefit selections
  updateJobOffer: async (id: string, selections: any) => {
    const { error } = await supabase
      .from("job_offer")
      .update(selections)
      .eq("id", id);

    if (error) throw error;
  },

  // Get median salary for a position
  getMedianSalary: async (position: string) => {
    const { data, error } = await supabase
      .from("median_salaries")
      .select("median_salary")
      .eq("position", position)
      .single();

    // If no data found, return a default so app doesn't crash
    if (error) return { median_salary: 60000 };
    return data;
  },

  // Save a rating linked to user and job offer
  saveRating: async (ratingData: {
    company_name: string;
    benefits: string;
    time_off: string;
    salary: string;
    overall_grade: string;
    user_id: string;
    job_offer_id: string;
    notes?: string;
  }) => {
    const { error } = await supabase.from("rating").insert([ratingData]);

    if (error) throw error;
  },

  // Get all ratings for current user
  getUserRatings: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("rating")
      .select("*")
      .eq("user_id", dbUser.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
