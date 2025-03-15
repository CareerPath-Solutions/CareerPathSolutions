import { supabase } from 'data/database/supabase';

class JobHistoryRepository {
  /**
   * Clear all job history records from the database
   * @returns Promise resolving to success or failure
   */
  async clearAllJobHistory(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_history')
        .delete()
        .is('archived', false);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in JobHistoryRepository:', error);
      throw error;
    }
  }

  /**
   * Get all job history for the current user
   * @param userId - The ID of the current user
   */
  async getJobHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('job_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching job history:', error);
      throw error;
    }
  }
}

export default JobHistoryRepository;