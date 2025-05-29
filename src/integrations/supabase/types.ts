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
      campaign_analytics: {
        Row: {
          bounced: number
          campaign_id: string | null
          clicked: number
          created_at: string
          delivered: number
          id: string
          opened: number
          total_sent: number
          unsubscribed: number
          updated_at: string
        }
        Insert: {
          bounced?: number
          campaign_id?: string | null
          clicked?: number
          created_at?: string
          delivered?: number
          id?: string
          opened?: number
          total_sent?: number
          unsubscribed?: number
          updated_at?: string
        }
        Update: {
          bounced?: number
          campaign_id?: string | null
          clicked?: number
          created_at?: string
          delivered?: number
          id?: string
          opened?: number
          total_sent?: number
          unsubscribed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          contact_list_id: string | null
          content: string
          created_at: string
          id: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subject: string | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_list_id?: string | null
          content: string
          created_at?: string
          id?: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string | null
          type: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_list_id?: string | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string | null
          type?: Database["public"]["Enums"]["campaign_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_contact_list_id_fkey"
            columns: ["contact_list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_list_memberships: {
        Row: {
          contact_id: string | null
          contact_list_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          contact_id?: string | null
          contact_list_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          contact_id?: string | null
          contact_list_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_memberships_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_memberships_contact_list_id_fkey"
            columns: ["contact_list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          batch_id: string | null
          email: string
          id: string
          reason: string | null
          status: Database["public"]["Enums"]["email_status"]
          user_id: string
          verification_date: string
        }
        Insert: {
          batch_id?: string | null
          email: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          user_id: string
          verification_date?: string
        }
        Update: {
          batch_id?: string | null
          email?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          user_id?: string
          verification_date?: string
        }
        Relationships: []
      }
      verification_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          invalid_emails: number
          processed_emails: number
          risky_emails: number
          status: Database["public"]["Enums"]["verification_status"]
          total_emails: number
          user_id: string
          valid_emails: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          invalid_emails?: number
          processed_emails?: number
          risky_emails?: number
          status?: Database["public"]["Enums"]["verification_status"]
          total_emails?: number
          user_id: string
          valid_emails?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          invalid_emails?: number
          processed_emails?: number
          risky_emails?: number
          status?: Database["public"]["Enums"]["verification_status"]
          total_emails?: number
          user_id?: string
          valid_emails?: number
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
      campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "paused"
        | "cancelled"
      campaign_type: "email" | "sms"
      email_status: "valid" | "invalid" | "risky" | "unknown"
      verification_status: "pending" | "completed" | "failed"
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
    Enums: {
      campaign_status: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "paused",
        "cancelled",
      ],
      campaign_type: ["email", "sms"],
      email_status: ["valid", "invalid", "risky", "unknown"],
      verification_status: ["pending", "completed", "failed"],
    },
  },
} as const
