import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

// TODO add app.config.ts file to utilize keys from .env(private location)
const supabaseUrl = 'https://pmgwkagndqhmpcwtopzg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3drYWduZHFobXBjd3RvcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMTgzOTQsImV4cCI6MjA0Nzg5NDM5NH0.XNQ2S7ZLuQINODwGBGmZyHIj-12T8mQ6f98uKMqi1ZI'

// Type safety for storageProvider methods below
interface StorageProvider {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

// Create a custom storage implementation that works in all environments
const customStorage: StorageProvider = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(key)//Synchronous(immediate); for web platform
      }
      return await AsyncStorage.getItem(key)//asynchronious; all other platforms
    } catch (e) {
      console.error('Error getting item from storage:', e)
      return null
    }
  },

  setItem: async (key, value) => {
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

  removeItem: async (key) => {
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

/**
 * Establishes reusable connection to DB using URL, KEY, and configuration object
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: false, // \
    persistSession: false,   //  - does not keep users logged in between sessions by using false
    detectSessionInUrl: true, // uses auth token for github login
  }
 })

// Set up error handling for auth state changes
// Clear storage of auth tokens on signout
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    customStorage.removeItem('supabase.auth.token')
    customStorage.removeItem('supabase.auth.refreshToken')
    AsyncStorage.clear()
  }
 })
