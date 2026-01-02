export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_edits: {
        Row: {
          admin_id: string
          analysis_level_id: string
          edited_at: string
          id: string
          note: string | null
        }
        Insert: {
          admin_id: string
          analysis_level_id: string
          edited_at?: string
          id?: string
          note?: string | null
        }
        Update: {
          admin_id?: string
          analysis_level_id?: string
          edited_at?: string
          id?: string
          note?: string | null
        }
        Relationships: []
      }
      contexts: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      cycle_explanations: {
        Row: {
          created_at: string
          id: string
          status_color: string
          summary_text: string
          unemployment_rate: number | null
          updated_at: string
          usd_krw: number | null
          yield_curve: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          status_color: string
          summary_text: string
          unemployment_rate?: number | null
          updated_at?: string
          usd_krw?: number | null
          yield_curve?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          status_color?: string
          summary_text?: string
          unemployment_rate?: number | null
          updated_at?: string
          usd_krw?: number | null
          yield_curve?: number | null
        }
        Relationships: []
      }
      interests: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          published_at: string
          source_id: string
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          published_at: string
          source_id: string
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          published_at?: string
          source_id?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_sources_TO_news"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      news_analysis_levels: {
        Row: {
          action_blurred: boolean
          created_at: string
          easy_action_all: Json | null
          easy_content: string
          easy_title: string
          easy_worst_all: Json | null
          hard_action_all: Json | null
          hard_content: string | null
          hard_title: string | null
          hard_worst_all: Json | null
          id: string
          interest: Json | null
          news_id: string
          normal_action_all: Json | null
          normal_content: string | null
          normal_title: string | null
          normal_worst_all: Json | null
        }
        Insert: {
          action_blurred?: boolean
          created_at?: string
          easy_action_all?: Json | null
          easy_content: string
          easy_title: string
          easy_worst_all?: Json | null
          hard_action_all?: Json | null
          hard_content?: string | null
          hard_title?: string | null
          hard_worst_all?: Json | null
          id?: string
          interest?: Json | null
          news_id: string
          normal_action_all?: Json | null
          normal_content?: string | null
          normal_title?: string | null
          normal_worst_all?: Json | null
        }
        Update: {
          action_blurred?: boolean
          created_at?: string
          easy_action_all?: Json | null
          easy_content?: string
          easy_title?: string
          easy_worst_all?: Json | null
          hard_action_all?: Json | null
          hard_content?: string | null
          hard_title?: string | null
          hard_worst_all?: Json | null
          id?: string
          interest?: Json | null
          news_id?: string
          normal_action_all?: Json | null
          normal_content?: string | null
          normal_title?: string | null
          normal_worst_all?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "news_analysis_levels_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string
          homepage_url: string
          id: string
          last_ingested_at: string
          name: string
          rss_url: string
        }
        Insert: {
          created_at?: string
          homepage_url: string
          id?: string
          last_ingested_at?: string
          name: string
          rss_url: string
        }
        Update: {
          created_at?: string
          homepage_url?: string
          id?: string
          last_ingested_at?: string
          name?: string
          rss_url?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean
          clerk_id: string
          ends_at: string
          id: string
          plan: string
          started_at: string
        }
        Insert: {
          active?: boolean
          clerk_id: string
          ends_at: string
          id?: string
          plan: string
          started_at?: string
        }
        Update: {
          active?: boolean
          clerk_id?: string
          ends_at?: string
          id?: string
          plan?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_users_TO_subscriptions"
            columns: ["clerk_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["clerk_id"]
          },
        ]
      }
      user_contexts: {
        Row: {
          clerk_id: string
          context_id: string
          created_at: string
        }
        Insert: {
          clerk_id: string
          context_id: string
          created_at?: string
        }
        Update: {
          clerk_id?: string
          context_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_contexts_TO_user_contexts"
            columns: ["context_id"]
            isOneToOne: false
            referencedRelation: "contexts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_users_TO_user_contexts"
            columns: ["clerk_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["clerk_id"]
          },
        ]
      }
      user_interests: {
        Row: {
          clerk_id: string
          created_at: string
          interest_id: string
        }
        Insert: {
          clerk_id: string
          created_at?: string
          interest_id: string
        }
        Update: {
          clerk_id?: string
          created_at?: string
          interest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_interests_TO_user_interests"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_users_TO_user_interests"
            columns: ["clerk_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["clerk_id"]
          },
        ]
      }
      users: {
        Row: {
          clerk_id: string
          email: string
          level: number
          name: string
          onboarded_at: string
        }
        Insert: {
          clerk_id: string
          email: string
          level?: number
          name: string
          onboarded_at?: string
        }
        Update: {
          clerk_id?: string
          email?: string
          level?: number
          name?: string
          onboarded_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
