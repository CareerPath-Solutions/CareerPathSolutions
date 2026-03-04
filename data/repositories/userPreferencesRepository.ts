import { supabase } from "../database/supabase";

export const userPreferencesRepository = {
  async getOrCreatePreferences(userId: string) {
    // Try to get existing preferences
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

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
    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) throw error;
  },
};
