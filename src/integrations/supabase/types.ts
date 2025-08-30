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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      app_global_people: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          updated_at: string
          updated_by: string | null
          user_role_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id: string
          updated_at?: string
          updated_by?: string | null
          user_role_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id?: string
          updated_at?: string
          updated_by?: string | null
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_person"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_role"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "app_user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_organization_admins: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          organization_id: string
          person_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id: string
          person_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id?: string
          person_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_organization_admins_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_app_org_admins_org"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "app_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_organization_people: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          organization_id: string
          person_id: string
          updated_at: string
          updated_by: string | null
          user_role_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id: string
          person_id: string
          updated_at?: string
          updated_by?: string | null
          user_role_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id?: string
          person_id?: string
          updated_at?: string
          updated_by?: string | null
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_app_org_people_org"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "app_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_app_org_people_person"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_app_org_people_role"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "app_user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_organizations: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          organization_name: string | null
          organization_state: string | null
          status: Database["public"]["Enums"]["organization_status_enum"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_name?: string | null
          organization_state?: string | null
          status?: Database["public"]["Enums"]["organization_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_name?: string | null
          organization_state?: string | null
          status?: Database["public"]["Enums"]["organization_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      app_user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          label_color: string | null
          role_name: Database["public"]["Enums"]["user_roles_enum"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          label_color?: string | null
          role_name?: Database["public"]["Enums"]["user_roles_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          label_color?: string | null
          role_name?: Database["public"]["Enums"]["user_roles_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      app_users: {
        Row: {
          account_email: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          status: Database["public"]["Enums"]["user_status_enum"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          account_email: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: Database["public"]["Enums"]["user_status_enum"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          account_email?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: Database["public"]["Enums"]["user_status_enum"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          first_name: string
          id: string
          is_deleted: boolean
          last_name: string
          middle_name: string | null
          status: Database["public"]["Enums"]["people_status_enum"]
          updated_at: string
          updated_by: string | null
          user_account_id: string | null
          user_profile_bio: string | null
          user_profile_pic: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          first_name: string
          id?: string
          is_deleted?: boolean
          last_name: string
          middle_name?: string | null
          status?: Database["public"]["Enums"]["people_status_enum"]
          updated_at?: string
          updated_by?: string | null
          user_account_id?: string | null
          user_profile_bio?: string | null
          user_profile_pic?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          first_name?: string
          id?: string
          is_deleted?: boolean
          last_name?: string
          middle_name?: string | null
          status?: Database["public"]["Enums"]["people_status_enum"]
          updated_at?: string
          updated_by?: string | null
          user_account_id?: string | null
          user_profile_bio?: string | null
          user_profile_pic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_user_account"
            columns: ["user_account_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      people_contacts: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string
          id: string
          is_deleted: boolean
          person_id: string
          phone: string | null
          phone_home: string | null
          state: string | null
          updated_at: string
          updated_by: string | null
          url_facebook: string | null
          url_instagram: string | null
          url_linkedin: string | null
          url_tiktok: string | null
          work_email: string | null
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email: string
          id?: string
          is_deleted?: boolean
          person_id: string
          phone?: string | null
          phone_home?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          url_facebook?: string | null
          url_instagram?: string | null
          url_linkedin?: string | null
          url_tiktok?: string | null
          work_email?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          id?: string
          is_deleted?: boolean
          person_id?: string
          phone?: string | null
          phone_home?: string | null
          state?: string | null
          updated_at?: string
          updated_by?: string | null
          url_facebook?: string | null
          url_instagram?: string | null
          url_linkedin?: string | null
          url_tiktok?: string | null
          work_email?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_contacts_person"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_contacts_emergency: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          first_name: string | null
          id: string
          is_deleted: boolean
          last_name: string | null
          person_id: string
          phone_number: string | null
          relationship:
            | Database["public"]["Enums"]["emergency_relationship_enum"]
            | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_deleted?: boolean
          last_name?: string | null
          person_id: string
          phone_number?: string | null
          relationship?:
            | Database["public"]["Enums"]["emergency_relationship_enum"]
            | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_deleted?: boolean
          last_name?: string | null
          person_id?: string
          phone_number?: string | null
          relationship?:
            | Database["public"]["Enums"]["emergency_relationship_enum"]
            | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_contacts_emergency_person"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_contacts_referrals: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          first_name: string
          id: string
          is_deleted: boolean
          last_name: string | null
          phone_number: string | null
          referral_note: string | null
          referral_relationship:
            | Database["public"]["Enums"]["referral_relationship_enum"]
            | null
          referral_type:
            | Database["public"]["Enums"]["referral_type_enum"]
            | null
          referred_by_id: string | null
          referred_by_name: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_deleted?: boolean
          last_name?: string | null
          phone_number?: string | null
          referral_note?: string | null
          referral_relationship?:
            | Database["public"]["Enums"]["referral_relationship_enum"]
            | null
          referral_type?:
            | Database["public"]["Enums"]["referral_type_enum"]
            | null
          referred_by_id?: string | null
          referred_by_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_deleted?: boolean
          last_name?: string | null
          phone_number?: string | null
          referral_note?: string | null
          referral_relationship?:
            | Database["public"]["Enums"]["referral_relationship_enum"]
            | null
          referral_type?:
            | Database["public"]["Enums"]["referral_type_enum"]
            | null
          referred_by_id?: string | null
          referred_by_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_contacts_referrals_referred_by"
            columns: ["referred_by_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_identifiers: {
        Row: {
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          deleted_at: string | null
          deleted_by: string | null
          ethnicity_identity: string | null
          gender_identity: string | null
          id: string
          insurance_expiration_date: string | null
          insurance_number: string | null
          insurance_provider: string | null
          is_deleted: boolean
          living_situation: string | null
          marital_status: string | null
          npi_number: string | null
          person_id: string
          ssn_number: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          ethnicity_identity?: string | null
          gender_identity?: string | null
          id?: string
          insurance_expiration_date?: string | null
          insurance_number?: string | null
          insurance_provider?: string | null
          is_deleted?: boolean
          living_situation?: string | null
          marital_status?: string | null
          npi_number?: string | null
          person_id: string
          ssn_number?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          ethnicity_identity?: string | null
          gender_identity?: string | null
          id?: string
          insurance_expiration_date?: string | null
          insurance_number?: string | null
          insurance_provider?: string | null
          is_deleted?: boolean
          living_situation?: string | null
          marital_status?: string | null
          npi_number?: string | null
          person_id?: string
          ssn_number?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_identifiers_person"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_with_admin: {
        Args: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          created_by_user_id: string
          organization_name: string
          organization_state: string
          organization_status?: Database["public"]["Enums"]["organization_status_enum"]
        }
        Returns: Json
      }
      get_organizations_with_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          created_at: string
          id: string
          organization_name: string
          organization_state: string
          status: Database["public"]["Enums"]["organization_status_enum"]
          storage_used: string
          user_count: number
        }[]
      }
      get_personal_profile: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      link_user_to_person: {
        Args: { new_user_id: string; user_email: string }
        Returns: Json
      }
      soft_delete_organization: {
        Args: { deleting_user_id: string; org_id: string }
        Returns: Json
      }
      update_organization_with_admin: {
        Args: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          org_id: string
          organization_name: string
          organization_state: string
          organization_status: Database["public"]["Enums"]["organization_status_enum"]
          updated_by_user_id: string
        }
        Returns: Json
      }
      update_personal_email: {
        Args: { p_email: string; p_updated_by: string }
        Returns: Json
      }
      update_personal_profile: {
        Args: {
          p_address_line_1: string
          p_address_line_2: string
          p_bio: string
          p_city: string
          p_facebook: string
          p_first_name: string
          p_instagram: string
          p_last_name: string
          p_linkedin: string
          p_middle_name: string
          p_phone: string
          p_profile_pic: string
          p_state: string
          p_tiktok: string
          p_updated_by: string
          p_zip_code: string
        }
        Returns: Json
      }
    }
    Enums: {
      emergency_relationship_enum:
        | "family member"
        | "friend"
        | "colleague"
        | "organization"
        | "other"
      organization_status_enum: "active" | "inactive" | "deleted"
      people_status_enum: "active" | "inactive" | "deleted"
      referral_relationship_enum:
        | "family member"
        | "friend"
        | "colleague"
        | "orgnaization"
        | "other"
      referral_type_enum: "client" | "staff"
      user_roles_enum:
        | "owner"
        | "admin"
        | "lead"
        | "client"
        | "staff"
        | "partner"
        | "general"
      user_status_enum: "invited" | "active" | "inactive" | "deleted"
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
    Enums: {
      emergency_relationship_enum: [
        "family member",
        "friend",
        "colleague",
        "organization",
        "other",
      ],
      organization_status_enum: ["active", "inactive", "deleted"],
      people_status_enum: ["active", "inactive", "deleted"],
      referral_relationship_enum: [
        "family member",
        "friend",
        "colleague",
        "orgnaization",
        "other",
      ],
      referral_type_enum: ["client", "staff"],
      user_roles_enum: [
        "owner",
        "admin",
        "lead",
        "client",
        "staff",
        "partner",
        "general",
      ],
      user_status_enum: ["invited", "active", "inactive", "deleted"],
    },
  },
} as const
