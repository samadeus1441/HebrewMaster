export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roots: {
        Row: {
          id: string
          root_letters: string
          meaning_core: string | null
          gizra_type: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          root_letters: string
          meaning_core?: string | null
          gizra_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          root_letters?: string
          meaning_core?: string | null
          gizra_type?: string | null
          created_at?: string
        }
      }
      binyanim: {
        Row: {
          id: string
          name_hebrew: string
          name_english: string
          grammatical_function: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          name_hebrew: string
          name_english: string
          grammatical_function?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_hebrew?: string
          name_english?: string
          grammatical_function?: string | null
          created_at?: string
        }
      }
      verbs: {
        Row: {
          id: string
          root_id: string
          binyan_id: string
          infinitive_nikud: string | null
          translation_eng: string | null
          difficulty_level: number
          created_at?: string
        }
        Insert: {
          id?: string
          root_id: string
          binyan_id: string
          infinitive_nikud?: string | null
          translation_eng?: string | null
          difficulty_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          root_id?: string
          binyan_id?: string
          infinitive_nikud?: string | null
          translation_eng?: string | null
          difficulty_level?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          card_id: string
          stability: number
          difficulty: number
          last_review: string
          next_review: string
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          stability?: number
          difficulty?: number
          last_review?: string
          next_review?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          stability?: number
          difficulty?: number
          last_review?: string
          next_review?: string
          created_at?: string
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
