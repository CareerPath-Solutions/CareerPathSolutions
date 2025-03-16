import { supabase } from '../database/supabase';
import { User, Rating, UserPreferences } from '../../core/types/user.types';

export const userRepository = {
    /**
     * [getCurrentAuthenticatedUser description]
     *
     * @return  {[type]}  [return description]
     */
    async getCurrentAuthenticatedUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * [createUser description]
     *
     * @param   {string}         username  [username description]
     * @param   {string<User>}   authId    [authId description]
     *
     * @return  {Promise<User>}            [return description]
     */
    async createUser(username: string, authId: string): Promise<User> {
        const { data, error } = await supabase
            .from("users")
            .insert([{
                user_name: username,
                auth_id: authId,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * [getRatingsByUserId description]
     *
     * @param   {string<Rating>[]}   username  [username description]
     *
     * @return  {Promise<Rating>[]}            [return description]
     */
    async getRatingsByUserId(username: string): Promise<Rating[]> {
        const { data: ratings, error } = await supabase
            .from('rating')
            .select(`
                company_name,
                overall_grade,
                users!inner(id, user_name)
            `)
            .eq('users.user_name', username);

        if (error) throw error;
        return ratings;
    },

    /**
     * [findUsersByUserName description]
     *
     * @param   {string}      username  [username description]
     *
     * @return  {<username>}            [return description]
     */
    async findUsersByUserName(username: string) {
        const { data: userIds, error } = await supabase
            .from('users')
            .select('id')
            .ilike('user_name', `%${username.trim()}%`);

        if (error) throw error;
        return userIds;
    },

    /**
     * [getUserByUsername description]
     *
     * @param   {string<User>}   username  [username description]
     *
     * @return  {Promise<User>}            [return description]
     */
    async getUserByUsername(username: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_name', username)
            .single();
            
        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                return null;
            }
            throw error;
        }
        
        return data;
    },
    
    /**
     * [getUserByEmail description]
     *
     * @param   {string<User>}   email  [email description]
     *
     * @return  {Promise<User>}         [return description]
     */
    async getUserByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                return null;
            }
            throw error;
        }
        
        return data;
    },

    /**
     * [getUserById description]
     *
     * @param   {string<User>}   userId  [userId description]
     *
     * @return  {Promise<User>}          [return description]
     */
    async getUserById(userId: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                return null;
            }
            throw error;
        }
        
        return data;
    },

    /**
     * [onAuthStateChange description]
     *
     * @param   {string}      callback  [callback description]
     *
     * @return  {<callback>}            [return description]
     */
    onAuthStateChange(callback: (event: string) => void) {
        // Return the subscription object directly from Supabase
        return supabase.auth.onAuthStateChange((event) => {
            callback(event);
        });
    },

    /**
     * [signOut description]
     *
     * @return  {[type]}  [return description]
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    },

    /**
     * [signInWithEmail description]
     *
     * @param   {string}  email     [email description]
     * @param   {string}  password  [password description]
     *
     * @return  {[type]}            [return description]
     */
    async signInWithEmail(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                console.error('Email sign-in error:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error("Sign in error:", error);
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
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        user_name: username
                    }
                }
            });
            
            if (error) {
                console.error('Email sign-up error:', error);
                throw error;
            }
            
            if (data?.user) {
                await this.createUser(
                    username, 
                    data.user.id
                );
            }
            
            return data;
        } catch (error) {
            console.error("Sign up error:", error);
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
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'joboffertool://reset-password'
            });
            
            if (error) {
                console.error('Password reset error:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error("Password reset error:", error);
            throw error;
        }
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
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },

    /**
     * [deleteUser description]
     *
     * @param   {string<boolean>}   userId  [userId description]
     *
     * @return  {Promise<boolean>}          [return description]
     */
    async deleteUser(userId: string): Promise<boolean> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);
            
        if (error) throw error;
        return true;
    },
    /**
     * [getOrCreateUserByAuthId description]
     *
     * @param   {string}         authId    [authId description]
     * @param   {string<User>}   username  [username description]
     *
     * @return  {Promise<User>}            [return description]
     */
    async getOrCreateUserByAuthId(authId: string, username: string): Promise<User> {
      try {
        const { data: allUsers, error: findAllError } = await supabase
          .from('users')
          .select('*');
          
        console.log("All users:", allUsers?.map(u => ({id: u.id, auth_id: u.auth_id})));
        
        const matchingUser = allUsers?.find(user => user.auth_id === authId);
        
        if (matchingUser) {
          console.log("Found matching user manually:", matchingUser.id);
          return matchingUser;
        }
        
        console.log("No matching user found, creating new one with authId:", authId);
        const newUser = await this.createUser(username, authId);
        return newUser;
      } catch (error) {
        console.error('Repository function error:', error);
        throw error;
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
        console.log("Saving preferences for userId:", userId);
        
        try {
          // First check if preferences exist for this user 
          const { data: existingPrefs, error: checkError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          let result;
          
          if (existingPrefs) {
            const { data, error } = await supabase
              .from('user_preferences')
              .update({
                health: preferences.health,
                vision: preferences.vision,
                vacation: preferences.vacation,
                sick: preferences.sick,
                maternity: preferences.maternity,
                paternity: preferences.paternity,
                religious_leave: preferences.religiousLeave,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .select()
              .single();
            
            if (error) throw error;
            result = data;
          } else {
            const { data, error } = await supabase
              .from('user_preferences')
              .insert([{
                user_id: userId,
                health: preferences.health,
                vision: preferences.vision,
                vacation: preferences.vacation, 
                sick: preferences.sick,
                maternity: preferences.maternity,
                paternity: preferences.paternity,
                religious_leave: preferences.religiousLeave,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select()
              .single();
            
            if (error) throw error;
            result = data;
          }
          
          return {
            health: result.health, 
            vision: result.vision,
            vacation: result.vacation,
            sick: result.sick,
            maternity: result.maternity,
            paternity: result.paternity,
            religiousLeave: result.religious_leave
          } as UserPreferences;
        } catch (error) {
          console.error("Error in saveUserPreferences:", error);
          throw error;
        }
      },

      /**
       * [getUserPreferencesById description]
       *
       * @param   {string<UserPreferences>}   userId  [userId description]
       *
       * @return  {Promise<UserPreferences>}          [return description]
       */
      async getUserPreferencesById(userId: string): Promise<UserPreferences | null> {
        console.log("[REPOSITORY] Getting preferences for userId:", userId, "type:", typeof userId);
        
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          console.log("[REPOSITORY] Query result:", data, "Error:", error);
            
          if (error) {
            if (error.code === 'PGRST116') { // No rows returned
              console.log("[REPOSITORY] No preferences found for userId:", userId);
              return null;
            }
            console.error("[REPOSITORY] Error fetching preferences:", error);
            throw error;
          }
          
          if (data) {
            console.log("[REPOSITORY] Found preferences:", data);
            return {
              health: data.health,
              vision: data.vision,
              vacation: data.vacation,
              sick: data.sick,
              maternity: data.maternity,
              paternity: data.paternity,
              religiousLeave: data.religious_leave
            } as UserPreferences;
          }
          
          console.log("[REPOSITORY] No data found but also no error");
          return null;
        } catch (error) {
          console.error("[REPOSITORY] Error in getUserPreferencesById:", error);
          throw error;
        }
      }
      
}