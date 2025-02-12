// business/services/userService.ts
import { userRepository } from '../../data/repositories/userRepository';
import { RatingDisplay } from '../../core/types/user.types';
import { supabase } from '../../data/database/supabase';

export const userService = {
    async getOrCreateUser() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error("No authenticated user");
          
          // Extract username from GitHub metadata
          const username = user.user_metadata.user_name || user.email?.split('@')[0];
          
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
      
    // async getOrCreateUser() {
    //     try {
    //         // Get current auth user
    //         const { data: { user } } = await supabase.auth.getUser();
    //         if (!user) throw new Error("No authenticated user");

    //         // Check if user exists in your users table
    //         const { data: existingUser } = await supabase
    //             .from('users')
    //             .select('*')
    //             .eq('auth_id', user.id)
    //             .single();

    //         if (existingUser) {
    //             return existingUser;
    //         }

    //         // If no existing user, create one using GitHub username
    //         const username = user.user_metadata.user_name || user.email?.split('@')[0];
    //         const newUser = await userRepository.createUser(username, user.id);
    //         return newUser;
    //     } catch (error) {
    //         console.error('Error in getOrCreateUser:', error);
    //         throw error;
    //     }
    // },

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

// import { userRepository } from '../../data/repositories/userRepository';
// import { RatingDisplay } from '../../core/types/user.types';

// export const userService = {
//     async validateUsername(username: string): Promise<boolean> {
//         if (!username.trim()) {
//             throw new Error("Username is required");
//         }
//         return true;
//     },

//     async createNewUser(username: string) {
//         await this.validateUsername(username);
//         return await userRepository.createUser(username);
//     },

//     async getPreviousOffers(username: string): Promise<RatingDisplay[]> {
//         await this.validateUsername(username);

//         const userIds = await userRepository.findUsersByUsername(username);
        
//         if (!userIds || userIds.length === 0) {
//             return [];
//         }

//         const ratings = await userRepository.getRatingsByUserIds(userIds.map(user => user.id));
        
//         return ratings.map(rating => ({
//             company: rating.company_name,
//             grade: rating.overall_grade
//         }));
//     }
// };