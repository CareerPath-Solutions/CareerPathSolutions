import { supabase } from '../database/supabase';

export const jobOfferRepository = {
  createUser: async (username: string) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ user_name: username }])
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
  }
};