import { supabase } from '../database/supabase';
import { User, Rating, UserPreferences } from '../../core/types/user.types';

export const userRepository = {
    /**
     * Get the currently authenticated user from Supabase
     */
    async getCurrentAuthenticatedUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Create a new user in the database
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
     * Get ratings by user ID
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
     * Find users by username (partial match)
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
     * Get a user by their exact username
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
     * Get user by email
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
     * Get user by ID
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
     * Set up a listener for authentication state changes
     */
    onAuthStateChange(callback: (event: string) => void) {
        // Return the subscription object directly from Supabase
        return supabase.auth.onAuthStateChange((event) => {
            callback(event);
        });
    },

    /**
     * Sign out the current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
    },

    /**
     * Sign in with email and password
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
     * Sign up with email and password
     */
    async signUpWithEmail(email: string, password: string, username: string) {
        try {
            // Create the auth user
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
            
            // If account creation was successful, create a profile in your users table
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
     * Reset password
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
     * Update user profile
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
     * Delete a user account
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
     * Get or create a user by their auth ID
     * (Generic version that works with any auth method)
     */
    async getOrCreateUserByAuthId(authId: string, username: string): Promise<User> {
        try {
            // Check if user exists
            const { data: existingUser, error: findError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', authId)
                .single();

            if (findError && findError.code !== 'PGRST116') {
                console.error('Error finding user:', findError);
                throw findError;
            }

            if (existingUser) {
                return existingUser;
            }

            // Create new user if not found
            return await this.createUser(username, authId);
        } catch (error) {
            console.error('Repository function error:', error);
            throw error;
        }
    },
    // async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences> {
    //     // Convert camelCase to snake_case for database
    //     const dbPreferences = {
    //       // Don't include ID in the data object
    //       health: preferences.health,
    //       vision: preferences.vision,
    //       vacation: preferences.vacation,
    //       sick: preferences.sick,
    //       maternity: preferences.maternity,
    //       paternity: preferences.paternity,
    //       religious_leave: preferences.religiousLeave // Convert camelCase to snake_case
    //     };
        
    //     // First check if preferences exist for this user
    //     const { data: existingPrefs } = await supabase
    //       .from('user_preferences')
    //       .select('*')
    //       .eq('id', userId)
    //       .single();
          
    //     let result;
        
    //     if (existingPrefs) {
    //       // Update existing preferences
    //       const { data, error } = await supabase
    //         .from('user_preferences')
    //         .update(dbPreferences)
    //         .eq('id', userId)
    //         .select()
    //         .single();
            
    //       if (error) throw error;
          
    //       // Convert snake_case back to camelCase for frontend
    //       result = {
    //         health: data.health,
    //         vision: data.vision,
    //         vacation: data.vacation,
    //         sick: data.sick,
    //         maternity: data.maternity,
    //         paternity: data.paternity,
    //         religiousLeave: data.religious_leave
    //       };
    //     } else {
    //       // Insert new preferences with user_id as a foreign key instead of id as primary key
    //       const { data, error } = await supabase
    //         .from('user_preferences')
    //         .insert([{
    //           user_id: userId,  // Use user_id instead of id
    //           ...dbPreferences
    //         }])
    //         .select()
    //         .single();
            
    //       if (error) throw error;
          
    //       // Convert snake_case back to camelCase for frontend
    //       result = {
    //         health: data.health,
    //         vision: data.vision,
    //         vacation: data.vacation,
    //         sick: data.sick,
    //         maternity: data.maternity,
    //         paternity: data.paternity,
    //         religiousLeave: data.religious_leave
    //       };
    //     }
        
    //     return result as UserPreferences;
    //   }
    async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences> {
        console.log("Saving preferences for userId:", userId);
        
        try {
          // First check if preferences exist for this user 
          const { data: existingPrefs, error: checkError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)  // Important: query by user_id, not id
            .single();
          
          let result;
          
          if (existingPrefs) {
            // Update existing preferences
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
              .eq('user_id', userId)  // Important: update by user_id, not id
              .select()
              .single();
            
            if (error) throw error;
            result = data;
          } else {
            // Insert new preferences with auto-generated UUID for id
            const { data, error } = await supabase
              .from('user_preferences')
              .insert([{
                // id is auto-generated as UUID
                user_id: userId,  // Use userId for the foreign key
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
          
          // Convert snake_case back to camelCase for frontend
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
      }
}