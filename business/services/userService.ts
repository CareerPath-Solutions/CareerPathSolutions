import { userRepository } from '../../data/repositories/userRepository';
import { RatingDisplay, User, UserPreferences } from '../../core/types/user.types';

/**
 * [DEFAULT_PREFERENCES description]
 *
 * @var {[type]}
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  health: 3,
  vision: 3,
  vacation: 3,
  sick: 3,
  maternity: 3,
  paternity: 3,
  religiousLeave: 3
};

/**
 * [userService description]
 *
 * @type {[type]}
 */
export const userService = {
  async getCurrentAuthenticatedUser() {
    return await userRepository.getCurrentAuthenticatedUser();
  },

  /**
   * [checkAuthentication description]
   *
   * @param   {any<User>}      authenticatedUser  [authenticatedUser description]
   *
   * @return  {Promise<User>}                     [return description]
   */
  async checkAuthentication(authenticatedUser: any): Promise<User | null> {
    if (!authenticatedUser) return null;
    const username = this._extractUsername(authenticatedUser);
    return await userRepository.getOrCreateUserByAuthId(authenticatedUser.id, username);
  },

  /**
   * [getPreviousOffers description]
   *
   * @param   {string<RatingDisplay>[]}   username  [username description]
   *
   * @return  {Promise<RatingDisplay>[]}            [return description]
   */
  async getPreviousOffers(username: string): Promise<RatingDisplay[]> {
    try {
      const ratings = await userRepository.getRatingsByUserId(username);
      return ratings.map(rating => ({
        company: rating.company_name,
        grade: rating.overall_grade
      }));
    } catch (error) {
      console.error('Error fetching previous offers:', error);
      return [];
    }
  },

  /**
   * [validateUsername description]
   *
   * @param   {string<boolean>}   username  [username description]
   *
   * @return  {Promise<boolean>}            [return description]
   */
  async validateUsername(username: string): Promise<boolean> {
    if (!username.trim()) {
      throw new Error("Username is required");
    }
    const users = await userRepository.findUsersByUserName(username);
    if (users && users.length > 0) {
      throw new Error("This username is already taken. Please choose another.");
    }
    return true;
  },

  /**
   * [getUserByUsername description]
   *
   * @param   {string<User>}   username  [username description]
   *
   * @return  {Promise<User>}            [return description]
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return await userRepository.getUserByUsername(username);
  },

  /**
   * [getUserByEmail description]
   *
   * @param   {string<User>}   email  [email description]
   *
   * @return  {Promise<User>}         [return description]
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await userRepository.getUserByEmail(email);
  },
  
  /**
   * [getUserById description]
   *
   * @param   {string<User>}   userId  [userId description]
   *
   * @return  {Promise<User>}          [return description]
   */
  async getUserById(userId: string): Promise<User | null> {
    return await userRepository.getUserById(userId);
  },

  /**
   * [signInWithEmail description]
   *
   * @param   {string}   email     [email description]
   * @param   {string}   password  [password description]
   *
   * @return  {<email>}            [return description]
   */
  async signInWithEmail(email: string, password: string) {
    try {
      return await userRepository.signInWithEmail(email, password);
    } catch (error) {
      console.error('Error in signInWithEmail service:', error);
      throw error;
    }
  },

  /**
   * [signUpWithEmail description]
   *
   * @param   {string}  email     [email description]
   * @param   {string}  password  [password description]
   * @param   {string}  username  [username description]
   *
   * @return  {[type]}            [return description]
   */
  async signUpWithEmail(email: string, password: string, username: string) {
    try {
      await this.validateUsername(username);
     
      return await userRepository.signUpWithEmail(email, password, username);
    } catch (error) {
      console.error('Error in signUpWithEmail service:', error);
      throw error;
    }
  },

  /**
   * [resetPassword description]
   *
   * @param   {string}  email  [email description]
   *
   * @return  {[type]}         [return description]
   */
  async resetPassword(email: string) {
    try {
      return await userRepository.resetPassword(email);
    } catch (error) {
      console.error('Error in resetPassword service:', error);
      throw error;
    }
  },

  /**
   * [onAuthStateChange description]
   *
   * @param   {string}  callback  [callback description]
   *
   * @return  {[type]}            [return description]
   */
  onAuthStateChange(callback: (event: string) => void) {
    return userRepository.onAuthStateChange(callback);
  },

  /**
   * [signOut description]
   *
   * @return  {[type]}  [return description]
   */
  async signOut() {
    return await userRepository.signOut();
  },
/**
 * [updateUserProfile description]
 *
 * @param   {string}                    userId   [userId description]
 * @param   {Partial<User>}             updates  [updates description]
 * @param   {undefined<Promise><User>}  User     [User description]
 *
 * @return  {<User><Promise><User>}              [return description]
 */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return await userRepository.updateUserProfile(userId, updates);
  },

  /**
   * [deleteUser description]
   *
   * @param   {string<boolean>}   userId  [userId description]
   *
   * @return  {Promise<boolean>}          [return description]
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await userRepository.deleteUser(userId);
  },

  /**
   * [getOrCreateUser description]
   *
   * @return  {<Promise><User>}[return description]
   */
  async getOrCreateUser(): Promise<User> {
    const authenticatedUser = await this.getCurrentAuthenticatedUser();
    if (!authenticatedUser) throw new Error("Not authenticated");

    const dbUser = await this.checkAuthentication(authenticatedUser);
    if (!dbUser) throw new Error("Failed to get or create user");

    return dbUser;
  },

  /**
   * [getUserPreferences description]
   *
   * @param   {string<UserPreferences>}   userId  [userId description]
   *
   * @return  {Promise<UserPreferences>}          [return description]
   */
  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const user = await userRepository.getUserById(userId);
      // Using type assertion to access preferences safely, falling back to defaults if not present
      const userPrefs = (user as any)?.preferences as UserPreferences | undefined;
      return userPrefs || DEFAULT_PREFERENCES;
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * [saveUserPreferences description]
   *
   * @param   {string}                            userId       [userId description]
   * @param   {UserPreferences<UserPreferences>}  preferences  [preferences description]
   *
   * @return  {Promise<UserPreferences>}                       [return description]
   */
  async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences> {
    try {
      // Save to user_preferences table instead of users table
      return await userRepository.saveUserPreferences(userId, preferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      throw error;
    }
  },
  _extractUsername(authenticatedUser: any): string {
    return authenticatedUser.user_metadata?.user_name ||
           authenticatedUser.email?.split('@')[0] ||
           `user_${authenticatedUser.id.slice(0, 8)}`;
  }
};