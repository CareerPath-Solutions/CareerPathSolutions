import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = 'https://pmgwkagndqhmpcwtopzg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3drYWduZHFobXBjd3RvcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMTgzOTQsImV4cCI6MjA0Nzg5NDM5NH0.XNQ2S7ZLuQINODwGBGmZyHIj-12T8mQ6f98uKMqi1ZI'

// Create a custom storage implementation that works in all environments
const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(key)
      }
      return await AsyncStorage.getItem(key)
    } catch (e) {
      console.error('Error getting item from storage:', e)
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(key, value)
        return
      }
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.error('Error setting item in storage:', e)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        return
      }
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.error('Error removing item from storage:', e)
    }
  }
}

// Initialize Supabase client with custom storage
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  }
})

// Set up error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any stored data if needed
    customStorage.removeItem('supabase.auth.token')
  }
})

