import { userRepository } from '../../data/repositories/userRepository';
import { RatingDisplay, User, UserPreferences } from '../../core/types/user.types';
import { supabase } from '../../data/database/supabase';
//import * as WebBrowser from "expo-web-browser";

/**
 * [userService description]
 *
 * @var {[type]}
 */
export const userService = {
  async getOrCreateUser() {
    try {
      /** 
       * Instead of doing this, we can destructure like on line 20
       *  const response = await supabase.auth.getUser();
          const data = response.data;
          const user = data.user;
      */
      const { data: { user } } = await supabase.auth.getUser();
     
      if (!user) throw new Error("No authenticated user");
      console.log('Auth user:', user);
     
      // Update display name from auth
      const displayName = user.user_metadata.user_name;
      await supabase.auth.updateUser({
         data: { display_name: displayName }
      });
      // Extract username from GitHub metadata
      // setup idea for possible email implementation, TODO: Determine if we want to delete
      const username = user.user_metadata.user_name || user.email?.split('@')[0];
     
      // Near start of getOrCreateUser to display debugging info:     DELETE DELETE DELETE
      console.log('Auth user:', user);
      console.log('Creating new user with:', {
          username,
          authId: user.id
      });
      // Check if user exists in your users table
      // if query is successful, then:
      // This query returns an object with two properties: data and error.
      const { data: existingUser, error: findError } = await supabase
        // Query runs first
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
     
      if (existingUser) return existingUser;
     
      // Create user if not exists
      // initialized Supabase client that provides methods to interact with your database.
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          user_name: username,
          auth_id: user.id
        })
        .select()
        .single();
     
        // if this line executes, we jup to line 67
      if (createError) throw createError;
     
      return newUser;
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw error;
    }
},
async getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
      // Try to get existing preferences from repository
      const preferences = await userRepository.getUserPreferences(userId);
      
      // If no preferences exist, return defaults
      if (!preferences) {
          return {
              health: 3,
              vision: 3,
              vacation: 3,
              sick: 3,
              maternity: 3,
              paternity: 3,
              religiousLeave: 3
          };
      }
      
      return preferences;
  } catch (error) {
      console.error('Error in getUserPreferences:', error);
      // Return default preferences if we can't get them
      return {
          health: 3,
          vision: 3,
          vacation: 3,
          sick: 3,
          maternity: 3,
          paternity: 3,
          religiousLeave: 3
      };
  }
},
/**
 * [saveUserPreferences description]
 *
 * @param   {string}                 userId       [userId description]
 * @param   {UserPreferences<void>}  preferences  [preferences description]
 *
 * @return  {Promise<void>}                       [return description]
 */
async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  try {
      await userRepository.saveUserPreferences(userId, preferences);
  } catch (error) {
      console.error('Error in saveUserPreferences:', error);
      throw error;
  }
},
  /**
   * [getCurrentAuthenticatedUser description]
   *
   * @return  {[type]}  [return description]
   */
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
    return await userRepository.getOrCreateGitHubUserByAuthId(authenticatedUser.id, username);
  },

  /**
   * [getOrCreateGitHubUser description]
   *
   * @param   {any<User>}      authenticatedUser  [authenticatedUser description]
   *
   * @return  {Promise<User>}                     [return description]
   */
  async getOrCreateGitHubUser(authenticatedUser: any): Promise<User | null> {
    if (!authenticatedUser) return null;
    const username = this._extractUsername(authenticatedUser);
    return await userRepository.getOrCreateGitHubUserByAuthId(authenticatedUser.id, username);
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
   * [signInWithGitHub description]
   *
   * @param   {string}         redirectUri  [redirectUri description]
   *
   * @return  {<redirectUri>}               [return description]
   */
  async signInWithGitHub(redirectUri: string) {
    try {
      // Use Supabase's built-in OAuth handling instead of manual URL construction
      return await userRepository.signInWithGitHub('github');
    } catch (error) {
      console.error("Error initiating GitHub sign-in:", error);
      throw error;
    }
  },

  /**
   * [createSessionFromUrl description]
   *
   * @param   {string}  url  [url description]
   *
   * @return  {[type]}       [return description]
   */
  async createSessionFromUrl(url: string) {
    try {
      const parsedUrl = new URL(url);
      const searchParams = new URLSearchParams(parsedUrl.search);
      const code = searchParams.get('code');
      
      if (code) {
        return await userRepository.exchangeCodeForSession(code);
      }
      return null;
    } catch (error) {
      console.error("Error creating session from URL:", error);
      return null;
    }
  },

  // setup a listener for authentication state changes
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

  // Private helper methods
  _extractUsername(authenticatedUser: any): string {
    return authenticatedUser.user_metadata?.user_name ||
           authenticatedUser.email?.split('@')[0] ||
           `github_user_${authenticatedUser.id.slice(0, 8)}`;
  },

  //TODO: This needs to be moved to userRepository
  _buildGitHubAuthUrl(redirectUri: string): string {
    const clientId = "0v23liXUkdfrifpf3qw7";// TODO Does this need to be concealed in .env file?????
    const authEndpoint = "https://github.com/login/oauth/authorize";
    
    // Create URL parameters manually
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state: Math.random().toString(36).substring(2, 15),
    });
    
    return `${authEndpoint}?${params.toString()}`;
  }
};