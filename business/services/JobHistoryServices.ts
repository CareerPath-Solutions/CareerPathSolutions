import JobHistoryRepository from 'data/repositories/JobHistoryRepository';

class JobHistoryService {
  private repository: JobHistoryRepository;

  constructor() {
    this.repository = new JobHistoryRepository();
  }

  /**
   * [clearJobHistory description]
   *
   * @return  {Promise<boolean>}[return description]
   */
  async clearJobHistory(): Promise<boolean> {
    try {
      return await this.repository.clearAllJobHistory();
    } catch (error) {
      console.error('Error in JobHistoryService:', error);
      throw error;
    }
  }

  /**
   * [getUserJobHistory description]
   *
   * @param   {string<any>[]}   userId  [userId description]
   *
   * @return  {Promise<any>[]}          [return description]
   */
  async getUserJobHistory(userId: string): Promise<any[]> {
    try {
      const history = await this.repository.getJobHistory(userId);
      
      const processedHistory = history.map(item => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString(),
        // Add any additional business logic transformations
      }));
      
      return processedHistory;
    } catch (error) {
      console.error('Error getting user job history:', error);
      throw error;
    }
  }
}

export default JobHistoryService;