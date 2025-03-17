import { supabase } from '../database/supabase';
import { JobOfferDetails } from '../../core/types/jobOffer.types';

/**
 * [jobOfferRepository description]
 *
 * @var {[type]}
 */
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

  /**
   * [async description]
   *
   * @return  {[type]}  [return description]
   */
  getLatestJobOffer: async () => {
    const { data, error } = await supabase
      .from("job_offer")
      .select()
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return data[0];
  },

  /**
   * [async description]
   *
   * @param   {number}  id          [id description]
   * @param   {any}     selections  [selections description]
   *
   * @return  {[type]}              [return description]
   */
  updateJobOffer: async (id: number, selections: any) => {
    const { error } = await supabase
      .from("job_offer")
      .update(selections)
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * [async description]
   *
   * @param   {string}  position  [position description]
   *
   * @return  {[type]}            [return description]
   */
  getMedianSalary: async (position: string) => {
    const { data, error } = await supabase
      .from('median_salaries')
      .select('median_salary')
      .eq('position', position)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * [async description]
   *
   * @param   {any}  ratingData  [ratingData description]
   *
   * @return  {[type]}           [return description]
   */
  saveRating: async (ratingData: any) => {
    const { error } = await supabase
      .from('rating')
      .insert([ratingData]);

    if (error) throw error;
  },

  /**
   * [async description]
   *
   * @param   {JobOfferDetails}  formData  [formData description]
   *
   * @return  {[type]}                     [return description]
   */
  createJobOffer: async (formData: JobOfferDetails) => {
    const { data, error } = await supabase
      .from("job_offer")
      .insert([formData])
      .select();

    if (error) throw error;
    return data;
  },
};