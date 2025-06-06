export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          auto_show: boolean | null
          background_color: string | null
          button_action: string
          button_color: string | null
          button_text: string | null
          button_url: string | null
          clicks: number | null
          created_at: string
          delay: number | null
          description: string | null
          id: string
          image_url: string | null
          position: string
          show_close_button: boolean | null
          status: string
          text_color: string | null
          title: string
          trigger_type: string
          type: string
          updated_at: string
          user_id: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          auto_show?: boolean | null
          background_color?: string | null
          button_action?: string
          button_color?: string | null
          button_text?: string | null
          button_url?: string | null
          clicks?: number | null
          created_at?: string
          delay?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          position?: string
          show_close_button?: boolean | null
          status?: string
          text_color?: string | null
          title: string
          trigger_type?: string
          type?: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          auto_show?: boolean | null
          background_color?: string | null
          button_action?: string
          button_color?: string | null
          button_text?: string | null
          button_url?: string | null
          clicks?: number | null
          created_at?: string
          delay?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          position?: string
          show_close_button?: boolean | null
          status?: string
          text_color?: string | null
          title?: string
          trigger_type?: string
          type?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          checklist_id: string
          created_at: string
          description: string | null
          id: string
          media_type: string | null
          media_url: string | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          checklist_id: string
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          checklist_id?: string
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          auto_hide: boolean | null
          button_text: string | null
          button_url: string | null
          completions: number | null
          created_at: string
          description: string | null
          id: string
          progress_bar_color: string | null
          show_progress: boolean | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          auto_hide?: boolean | null
          button_text?: string | null
          button_url?: string | null
          completions?: number | null
          created_at?: string
          description?: string | null
          id?: string
          progress_bar_color?: string | null
          show_progress?: boolean | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          auto_hide?: boolean | null
          button_text?: string | null
          button_url?: string | null
          completions?: number | null
          created_at?: string
          description?: string | null
          id?: string
          progress_bar_color?: string | null
          show_progress?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      survey_questions: {
        Row: {
          created_at: string
          id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
          required: boolean | null
          survey_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json | null
          order_index?: number
          question_text: string
          question_type?: string
          required?: boolean | null
          survey_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
          required?: boolean | null
          survey_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response_data: Json
          session_id: string | null
          survey_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response_data: Json
          session_id?: string | null
          survey_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response_data?: Json
          session_id?: string | null
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          auto_show: boolean | null
          background_color: string | null
          button_color: string | null
          created_at: string
          delay: number | null
          description: string | null
          id: string
          position: string
          responses: number | null
          show_close_button: boolean | null
          show_progress: boolean | null
          status: string
          text_color: string | null
          title: string
          trigger_type: string
          type: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          auto_show?: boolean | null
          background_color?: string | null
          button_color?: string | null
          created_at?: string
          delay?: number | null
          description?: string | null
          id?: string
          position?: string
          responses?: number | null
          show_close_button?: boolean | null
          show_progress?: boolean | null
          status?: string
          text_color?: string | null
          title: string
          trigger_type?: string
          type?: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          auto_show?: boolean | null
          background_color?: string | null
          button_color?: string | null
          created_at?: string
          delay?: number | null
          description?: string | null
          id?: string
          position?: string
          responses?: number | null
          show_close_button?: boolean | null
          show_progress?: boolean | null
          status?: string
          text_color?: string | null
          title?: string
          trigger_type?: string
          type?: string
          updated_at?: string
          user_id?: string
          views?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
