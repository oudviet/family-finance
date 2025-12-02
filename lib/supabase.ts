import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Database interface for type safety
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          amount: number
          category: string
          description?: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          description?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          description?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color?: string
          user_id?: string
          created_at: string
        }
        Insert: {
          name: string
          color?: string
          user_id?: string
          created_at?: string
        }
        Update: {
          name?: string
          color?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
          updated_at: string
        }
        Insert: {
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
          updated_at?: string
        }
        Update: {
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
          updated_at?: string
        }
      }
    }
  }
}

// Client-side Supabase client for React components (useEffect, hooks)
export const createClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )
}

// Server-side Supabase client for API routes and Server Components
export const getServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}

// API client for server-side operations (API routes)
export const createApiClient = () => {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Types for expense operations
export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Helper function to check if environment variables are set
export const checkSupabaseConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const optionalEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    return false
  }

  const optionalMissing = optionalEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (optionalMissing.length > 0) {
    console.warn(`Missing optional environment variables: ${optionalMissing.join(', ')}`)
  }

  return true
}