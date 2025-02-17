// business/services/userService.ts
import { userRepository } from '../../data/repositories/userRepository';
import { RatingDisplay } from '../../core/types/user.types';
import { supabase } from '../../data/database/supabase';

export const userService = {
    async getOrCreateUser() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error("No authenticated user");

          console.log('Auth user:', user);
          
          // Update display name from auth
          const displayName = user.user_metadata.user_name;
          await supabase.auth.updateUser({
             data: { display_name: displayName }
          });

          // Extract username from GitHub metadata
          const username = user.user_metadata.user_name || user.email?.split('@')[0];
          
          // Near start of getOrCreateUser to display debugging info:     DELETE DELETE DELETE
          console.log('Auth user:', user);
          console.log('Creating new user with:', {
              username,
              authId: user.id
          });

          // Check if user exists in your users table
          const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', user.id)
            .single();
          
          if (existingUser) return existingUser;
          
          // Create user if not exists
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              user_name: username,
              auth_id: user.id
            })
            .select()
            .single();
          
          if (createError) throw createError;
          
          return newUser;
        } catch (error) {
          console.error('Error in getOrCreateUser:', error);
          throw error;
        }
      },
  
    async getPreviousOffers(userId: string): Promise<RatingDisplay[]> {
        try {
            const ratings = await userRepository.getRatingsByUserId(userId);
            return ratings.map(rating => ({
                company: rating.company_name,
                grade: rating.overall_grade
            }));
        } catch (error) {
            console.error('Error in getPreviousOffers:', error);
            throw error;
        }
    }
};