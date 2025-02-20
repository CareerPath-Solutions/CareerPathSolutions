// data/repositories/userRepository.ts
import { supabase } from '../database/supabase';
import { User, Rating } from '../../core/types/user.types';

export const userRepository = {
    async createUser(username: string, authId: string): Promise<User> {
        console.log('Creating user:', { username, authId });
        const { data, error } = await supabase
            .from("users")
            .insert([{ 
                user_name: username, 
                auth_id: authId,
                created_at: new Date() 
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

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
    }
};