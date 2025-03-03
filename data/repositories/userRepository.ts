import { supabase } from '../database/supabase';
import { User, Rating, UserPreferences } from '../../core/types/user.types';

/**
 * [userRepository description]
 *
 * @var {[type]}
 */
export const userRepository = {
    async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
        // Check if preferences already exist
        const { data: existing, error: checkError } = await supabase
            .from("user_preferences")
            .select("id")
            .eq("user_id", userId)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') throw checkError;
        
        const preferencesData = {
            user_id: userId,
            health: preferences.health,
            vision: preferences.vision,
            vacation: preferences.vacation,
            sick: preferences.sick,
            maternity: preferences.maternity,
            paternity: preferences.paternity,
            religious_leave: preferences.religiousLeave,
            updated_at: new Date()
        };
        
        if (existing) {
            // Update existing preferences
            const { error } = await supabase
                .from("user_preferences")
                .update(preferencesData)
                .eq("user_id", userId);
            
            if (error) throw error;
        } else {
            // Insert new preferences
            const { error } = await supabase
                .from("user_preferences")
                .insert({
                    ...preferencesData,
                    created_at: new Date()
                });
            
            if (error) throw error;
        }
    },
    /**
     * [getUserPreferences description]
     *
     * @param   {string<UserPreferences>}   userId  [userId description]
     *
     * @return  {Promise<UserPreferences>}          [return description]
     */
    async getUserPreferences(userId: string): Promise<UserPreferences | null> {
        const { data, error } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id", userId)
            .single();
        
        if (error) {
            // If no record found, return null instead of throwing
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        // Convert DB snake_case to app camelCase
        if (data) {
            return {
                health: data.health,
                vision: data.vision,
                vacation: data.vacation,
                sick: data.sick,
                maternity: data.maternity,
                paternity: data.paternity,
                religiousLeave: data.religious_leave
            };
        }
        
        return null;
    },
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
     * [getOrCreateGitHubUserByAuthId description]
     *
     * @param   {string}         authId    [authId description]
     * @param   {string<User>}   username  [username description]
     *
     * @return  {Promise<User>}            [return description]
     */
    async getOrCreateGitHubUserByAuthId(authId: string, username: string): Promise<User> {
        console.log('Starting repository function with auth ID:', authId);
        try {
            // Check if user exists
            const { data: existingUser, error: findError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', authId)
                .single();

            console.log('Database query result:', existingUser ? 'User found' : 'User not found', findError ? `Error: ${findError.message}` : 'No error');

            if (findError && findError.code !== 'PGRST116') {
                console.error('Error finding user:', findError);
                throw findError;
            }

            if (existingUser) {
                console.log('Returning existing user');
                return existingUser;
            }

            // Create new user if not found
            console.log('Creating new user with username:', username);
            return await this.createUser(username, authId);
        } catch (error) {
            console.error('Repository function error:', error);
            throw error;
        }
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
     * [exchangeCodeForSession description]
     *
     * @param   {string}  code  [code description]
     *
     * @return  {[type]}        [return description]
     */
    async exchangeCodeForSession(code: string) {
        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error("Error exchanging code for session:", error);
            throw error;
        }
    },

    /**
     * [signInWithGitHub description]
     *
     * @param   {github}  provider  [provider description]
     *
     * @return  {[type]}            [return description]
     */
    async signInWithGitHub(provider: 'github') {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        return data;
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
    }
};