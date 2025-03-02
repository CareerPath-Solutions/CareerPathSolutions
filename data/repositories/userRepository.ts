import { supabase } from '../database/supabase';
import { User, Rating } from '../../core/types/user.types';

export const userRepository = {
    /**
     * Get the currently authenticated user from Supabase
     */
    async getCurrentAuthenticatedUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Get or create a user by their GitHub auth ID
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
     * Exchange an OAuth code for a session
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
     * Initiate GitHub OAuth sign-in
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
    }
};