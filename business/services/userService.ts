// business/services/userService.ts
import { userRepository } from '../../data/repositories/userRepository';
import { RatingDisplay } from '../../core/types/user.types';

export const userService = {
    async validateUsername(username: string): Promise<boolean> {
        if (!username.trim()) {
            throw new Error("Username is required");
        }
        return true;
    },

    async createNewUser(username: string) {
        await this.validateUsername(username);
        return await userRepository.createUser(username);
    },

    async getPreviousOffers(username: string): Promise<RatingDisplay[]> {
        await this.validateUsername(username);

        const userIds = await userRepository.findUsersByUsername(username);
        
        if (!userIds || userIds.length === 0) {
            return [];
        }

        const ratings = await userRepository.getRatingsByUserIds(userIds.map(user => user.id));
        
        return ratings.map(rating => ({
            company: rating.company_name,
            grade: rating.overall_grade
        }));
    }
};