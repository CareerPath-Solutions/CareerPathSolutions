// data/repositories/userRepository.ts
import { supabase } from '../database/supabase';
import { User, Rating } from '../../core/types/user.types';

export const userRepository = {
    async createUser(username: string): Promise<User> {
        const { data, error } = await supabase
            .from("users")
            .insert([{ user_name: username, created_at: new Date() }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async findUsersByUsername(username: string) {
        const { data: userIds, error } = await supabase
            .from('users')
            .select('id')
            .ilike('user_name', `%${username.trim()}%`);

        if (error) throw error;
        return userIds;
    },

    async getRatingsByUserIds(userIds: string[]) {
        const { data: ratings, error } = await supabase
            .from('rating')
            .select('company_name, overall_grade')
            .in('user_id', userIds);

        if (error) throw error;
        return ratings;
    }
};