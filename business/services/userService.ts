import { userRepository } from "../../data/repositories/userRepository";
import { RatingDisplay, User } from "../../core/types/user.types";

// Removed unused WebBrowser import

export const userService = {
  /**
   * Get the currently authenticated user
   */
  async getCurrentAuthenticatedUser() {
    return await userRepository.getCurrentAuthenticatedUser();
  },

  /**
   * Check if a user is authenticated and get their DB user
   */
  async checkAuthentication(authenticatedUser: any): Promise<User | null> {
    if (!authenticatedUser) return null;
    const username = this._extractUsername(authenticatedUser);
    return await userRepository.getOrCreateGitHubUserByAuthId(
      authenticatedUser.id,
      username,
    );
  },

  /**
   * Get or create a GitHub user in the database
   */
  async getOrCreateGitHubUser(authenticatedUser: any): Promise<User | null> {
    if (!authenticatedUser) return null;
    const username = this._extractUsername(authenticatedUser);
    return await userRepository.getOrCreateGitHubUserByAuthId(
      authenticatedUser.id,
      username,
    );
  },

  /**
   * Get previous offers/ratings for a user
   */
  async getPreviousOffers(username: string): Promise<RatingDisplay[]> {
    try {
      const ratings = await userRepository.getRatingsByUserId(username);
      return ratings.map((rating) => ({
        company: rating.company_name,
        grade: rating.overall_grade,
      }));
    } catch (error) {
      console.error("Error fetching previous offers:", error);
      return [];
    }
  },

  /**
   * Validate a username (check if available)
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
   * Get a user by their username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    return await userRepository.getUserByUsername(username);
  },

  /**
   * Sign in with GitHub OAuth
   * Removed unused redirectUri parameter
   */
  async signInWithGitHub() {
    try {
      return await userRepository.signInWithGitHub("github");
    } catch (error) {
      console.error("Error initiating GitHub sign-in:", error);
      throw error;
    }
  },

  /**
   * Create a session from a redirect URL containing an auth code
   */
  async createSessionFromUrl(url: string) {
    try {
      const parsedUrl = new URL(url);
      const searchParams = new URLSearchParams(parsedUrl.search);
      const code = searchParams.get("code");

      if (code) {
        return await userRepository.exchangeCodeForSession(code);
      }
      return null;
    } catch (error) {
      console.error("Error creating session from URL:", error);
      return null;
    }
  },

  /**
   * Set up a listener for authentication state changes
   */
  onAuthStateChange(callback: (event: string) => void) {
    return userRepository.onAuthStateChange(callback);
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    return await userRepository.signOut();
  },

  /**
   * Update a user's profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<User>,
  ): Promise<User> {
    return await userRepository.updateUserProfile(userId, updates);
  },

  /**
   * Delete a user account
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await userRepository.deleteUser(userId);
  },

  // Private helper methods
  _extractUsername(authenticatedUser: any): string {
    return (
      authenticatedUser.user_metadata?.user_name ||
      authenticatedUser.email?.split("@")[0] ||
      `github_user_${authenticatedUser.id.slice(0, 8)}`
    );
  },

  _buildGitHubAuthUrl(redirectUri: string): string {
    const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

    // Throw early if client ID is not configured
    if (!clientId) {
      throw new Error(
        "EXPO_PUBLIC_GITHUB_CLIENT_ID is not set. Check your .env file.",
      );
    }

    const authEndpoint = "https://github.com/login/oauth/authorize";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state: Math.random().toString(36).substring(2, 15),
    });

    return `${authEndpoint}?${params.toString()}`;
  },
};
