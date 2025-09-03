import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          user_id: string
          title: string
          vibe: string
          audience: 'gen_z' | 'millennials' | 'both'
          platform: 'instagram' | 'tiktok' | 'linkedin' | 'facebook'
          output_type: 'campaign_mockup' | 'shoot_ideas' | 'set_brief'
          spotify_playlist_id: string | null
          film_recommendations: any[] | null
          moodboard_images: any[] | null
          hashtags: string[] | null
          post_ideas: string[] | null
          ai_rationale: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          vibe: string
          audience: 'gen_z' | 'millennials' | 'both'
          platform: 'instagram' | 'tiktok' | 'linkedin' | 'facebook'
          output_type: 'campaign_mockup' | 'shoot_ideas' | 'set_brief'
          spotify_playlist_id?: string | null
          film_recommendations?: any[] | null
          moodboard_images?: any[] | null
          hashtags?: string[] | null
          post_ideas?: string[] | null
          ai_rationale?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          vibe?: string
          audience?: 'gen_z' | 'millennials' | 'both'
          platform?: 'instagram' | 'tiktok' | 'linkedin' | 'facebook'
          output_type?: 'campaign_mockup' | 'shoot_ideas' | 'set_brief'
          spotify_playlist_id?: string | null
          film_recommendations?: any[] | null
          moodboard_images?: any[] | null
          hashtags?: string[] | null
          post_ideas?: string[] | null
          ai_rationale?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}