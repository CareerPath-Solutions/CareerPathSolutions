import { supabase } from "../database/supabase";

const PGRST116 = "PGRST116"; // Supabase "no rows returned" error code

export const userPreferencesRepository = {
  async getOrCreatePreferences(userId: string) {
    // Try to get existing preferences
    const { data: existing, error: findError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Only treat "no rows" as not found — throw everything else
    if (findError && findError.code !== PGRST116) throw findError;
    if (existing) return existing;

    // Create default preferences if none exist
    const { data: newPrefs, error } = await supabase
      .from("user_preferences")
      .insert([
        {
          user_id: userId,
          health: 3,
          vision: 3,
          vacation: 3,
          sick: 3,
          maternity: 3,
          paternity: 3,
          religious_leave: 3,
          stock_options: 3,
          retirement: 3,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return newPrefs;
  },

  async savePreferences(userId: string, preferences: any) {
    // Spread preferences first, then set user_id last
    // This prevents caller from accidentally overriding user_id
    const { error } = await supabase.from("user_preferences").upsert(
      {
        ...preferences,
        user_id: userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
  },
};
