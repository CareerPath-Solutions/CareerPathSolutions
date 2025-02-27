import { supabase } from '../database/supabase';
import { JobOfferDetails } from '../../core/types/jobOffer.types';

export const jobOfferRepository = {
  createUser: async (username: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        user_name: username,
        auth_id: user.id,
        created_at: new Date()
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  getLatestJobOffer: async () => {
    const { data, error } = await supabase
      .from("job_offer")
      .select()
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data[0];
  },

  updateJobOffer: async (id: number, selections: any) => {
    const { error } = await supabase
      .from("job_offer")
      .update(selections)
      .eq("id", id);

    if (error) throw error;
  },

  getMedianSalary: async (position: string) => {
    const { data, error } = await supabase
      .from('median_salaries')
      .select('median_salary')
      .eq('position', position)
      .single();

    if (error) throw error;
    return data;
  },

  saveRating: async (ratingData: any) => {
    const { error } = await supabase
      .from('rating')
      .insert([ratingData]);

    if (error) throw error;
  },

  createJobOffer: async (formData: JobOfferDetails) => {
    const { data, error } = await supabase
      .from("job_offer")
      .insert([formData])
      .select();

    if (error) throw error;
    return data;
  },
};