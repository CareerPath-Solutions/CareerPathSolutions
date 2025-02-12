import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://pmgwkagndqhmpcwtopzg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3drYWduZHFobXBjd3RvcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMTgzOTQsImV4cCI6MjA0Nzg5NDM5NH0.XNQ2S7ZLuQINODwGBGmZyHIj-12T8mQ6f98uKMqi1ZI'

const options = {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, options)