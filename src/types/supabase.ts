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
      poems: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          content: string
          cover_image: string
          language: string
          is_listed: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          content: string
          cover_image: string
          language: string
          is_listed?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          content?: string
          cover_image?: string
          language?: string
          is_listed?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
}