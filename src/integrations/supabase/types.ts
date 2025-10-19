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
      app_agencies: {
        Row: {
          agency_name: string
          agency_state: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          status: Database["public"]["Enums"]["agency_status_enum"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_name: string
          agency_state?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: Database["public"]["Enums"]["agency_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_name?: string
          agency_state?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: Database["public"]["Enums"]["agency_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      app_agencies_admins: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_agencies_admins_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_organization_admins_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      app_agencies_people: {
        Row: {
          agency_id: string
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
          user_staff_type_id: string | null
        }
        Insert: {
          agency_id: string
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
          user_staff_type_id?: string | null
        }
        Update: {
          agency_id?: string
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
          user_staff_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_agencies_people_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_agencies_people_user_staff_type_id_fkey"
            columns: ["user_staff_type_id"]
            isOneToOne: false
            referencedRelation: "app_user_staff_types"
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
      app_data_labels: {
        Row: {
          created_at: string
          created_by: string | null
          font_weight: string | null
          id: string
          label_category: string | null
          label_color: string | null
          label_name: string | null
          text_color: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          font_weight?: string | null
          id?: string
          label_category?: string | null
          label_color?: string | null
          label_name?: string | null
          text_color?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          font_weight?: string | null
          id?: string
          label_category?: string | null
          label_color?: string | null
          label_name?: string | null
          text_color?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      app_data_programs: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          program_name: string | null
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
          program_name?: string | null
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
          program_name?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      app_data_programs_goals: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          goal_name: string | null
          id: string
          is_deleted: boolean
          program_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          goal_name?: string | null
          id?: string
          is_deleted?: boolean
          program_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          goal_name?: string | null
          id?: string
          is_deleted?: boolean
          program_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_data_programs_goals_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "app_data_programs"
            referencedColumns: ["id"]
          },
        ]
      }
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
      app_organizations_owners: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          organization_id: string
          owner_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id: string
          owner_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          organization_id?: string
          owner_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_organization_owners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "app_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_organization_owners_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          updated_at: string
          updated_by: string | null
          user_permissions: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
          user_permissions?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
          user_permissions?: string | null
        }
        Relationships: []
      }
      app_user_permissions_role: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          updated_at: string
          updated_by: string | null
          user_permission_id: string
          user_role_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
          user_permission_id: string
          user_role_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
          user_permission_id?: string
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_permissions_role_user_permission_id_fkey"
            columns: ["user_permission_id"]
            isOneToOne: false
            referencedRelation: "app_user_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_permissions_role_user_role_id_fkey"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "app_user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_permissions_staff_type: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          staff_type_id: string
          updated_at: string
          updated_by: string | null
          user_permission_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          staff_type_id: string
          updated_at?: string
          updated_by?: string | null
          user_permission_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          staff_type_id?: string
          updated_at?: string
          updated_by?: string | null
          user_permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_permissions_staff_type_staff_type_id_fkey"
            columns: ["staff_type_id"]
            isOneToOne: false
            referencedRelation: "app_user_staff_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_permissions_staff_type_user_permission_id_fkey"
            columns: ["user_permission_id"]
            isOneToOne: false
            referencedRelation: "app_user_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          role_label_id: string | null
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
          role_label_id?: string | null
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
          role_label_id?: string | null
          role_name?: Database["public"]["Enums"]["user_roles_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_user_roles_role_label_id_fkey"
            columns: ["role_label_id"]
            isOneToOne: false
            referencedRelation: "app_data_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_staff_types: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          staff_type: Database["public"]["Enums"]["staff_type_enum"]
          staff_type_label_id: string | null
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
          staff_type: Database["public"]["Enums"]["staff_type_enum"]
          staff_type_label_id?: string | null
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
          staff_type?: Database["public"]["Enums"]["staff_type_enum"]
          staff_type_label_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_user_staff_types_staff_type_label_id_fkey"
            columns: ["staff_type_label_id"]
            isOneToOne: false
            referencedRelation: "app_data_labels"
            referencedColumns: ["id"]
          },
        ]
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
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cal_atoms_users: {
        Row: {
          access_token: string
          cal_user_id: number
          created_at: string | null
          email: string
          id: number
          orbit_user_id: string | null
          refresh_token: string
          updated_at: string | null
          username: string
        }
        Insert: {
          access_token: string
          cal_user_id: number
          created_at?: string | null
          email: string
          id?: number
          orbit_user_id?: string | null
          refresh_token: string
          updated_at?: string | null
          username: string
        }
        Update: {
          access_token?: string
          cal_user_id?: number
          created_at?: string | null
          email?: string
          id?: number
          orbit_user_id?: string | null
          refresh_token?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      cal_calendar_users: {
        Row: {
          appointment_type: string | null
          calendar_owner_id: string | null
          calendar_url: string | null
          created_at: string
          created_by: string
          id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          appointment_type?: string | null
          calendar_owner_id?: string | null
          calendar_url?: string | null
          created_at?: string
          created_by: string
          id?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          appointment_type?: string | null
          calendar_owner_id?: string | null
          calendar_url?: string | null
          created_at?: string
          created_by?: string
          id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      forms_submissions: {
        Row: {
          agency_id: string
          archived_at: string | null
          archived_by_user_id: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by_user_id: string | null
          form_id: string | null
          id: string
          is_deleted: boolean
          sub_track_id: string | null
          submission_data: Json
          submission_status: string
          submitted_by_id: string
          updated_at: string | null
          updated_by_id: string | null
        }
        Insert: {
          agency_id: string
          archived_at?: string | null
          archived_by_user_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          form_id?: string | null
          id?: string
          is_deleted?: boolean
          sub_track_id?: string | null
          submission_data: Json
          submission_status?: string
          submitted_by_id: string
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Update: {
          agency_id?: string
          archived_at?: string | null
          archived_by_user_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by_user_id?: string | null
          form_id?: string | null
          id?: string
          is_deleted?: boolean
          sub_track_id?: string | null
          submission_data?: Json
          submission_status?: string
          submitted_by_id?: string
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_submissions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_submissions_submitted_by_id_fkey"
            columns: ["submitted_by_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_submissions_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      mailerlite_event_items: {
        Row: {
          automation_id: string | null
          campaign_id: string | null
          created_at: string
          event_data: Json | null
          event_timestamp: string
          event_type: string
          group_id: string | null
          id: string
          mailerlite_event_id: string
          matched_to_person: boolean
          person_id: string | null
          subscriber_email: string
          subscriber_mailerlite_id: string | null
        }
        Insert: {
          automation_id?: string | null
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_timestamp: string
          event_type: string
          group_id?: string | null
          id?: string
          mailerlite_event_id: string
          matched_to_person?: boolean
          person_id?: string | null
          subscriber_email: string
          subscriber_mailerlite_id?: string | null
        }
        Update: {
          automation_id?: string | null
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_timestamp?: string
          event_type?: string
          group_id?: string | null
          id?: string
          mailerlite_event_id?: string
          matched_to_person?: boolean
          person_id?: string | null
          subscriber_email?: string
          subscriber_mailerlite_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailerlite_event_items_mailerlite_event_id_fkey"
            columns: ["mailerlite_event_id"]
            isOneToOne: false
            referencedRelation: "mailerlite_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailerlite_event_items_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      mailerlite_events: {
        Row: {
          agency_id: string
          batch_size: number | null
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          is_batch: boolean
          processed_at: string | null
          processing_status: string
          raw_payload: Json
          received_at: string
          webhook_id: string
        }
        Insert: {
          agency_id: string
          batch_size?: number | null
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          is_batch?: boolean
          processed_at?: string | null
          processing_status?: string
          raw_payload: Json
          received_at?: string
          webhook_id: string
        }
        Update: {
          agency_id?: string
          batch_size?: number | null
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          is_batch?: boolean
          processed_at?: string | null
          processing_status?: string
          raw_payload?: Json
          received_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mailerlite_events_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailerlite_events_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "settings_integrations_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      mailerlite_sync_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          person_id: string
          sync_status: string
          sync_type: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          person_id: string
          sync_status: string
          sync_type?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          person_id?: string
          sync_status?: string
          sync_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailerlite_sync_log_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
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
          staff_type_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
          user_account_id: string | null
          user_profile_bio: string | null
          user_profile_pic: string | null
          user_role_id: string
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
          staff_type_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_account_id?: string | null
          user_profile_bio?: string | null
          user_profile_pic?: string | null
          user_role_id: string
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
          staff_type_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_account_id?: string | null
          user_profile_bio?: string | null
          user_profile_pic?: string | null
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_people_user_account"
            columns: ["user_account_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_staff_type_id_fkey"
            columns: ["staff_type_id"]
            isOneToOne: false
            referencedRelation: "app_user_staff_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_user_role_id_fkey"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "app_user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_assessor: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_assign_assessor_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_assign_assessor_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_provider: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          person_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_assign_provider_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_assign_provider_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_service: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          service_id: string
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
          person_id: string
          service_id: string
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
          person_id?: string
          service_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_assign_service_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_assign_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "settings_services_and_fees"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_staff_type: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
          staff_type_id: string
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
          person_id: string
          staff_type_id: string
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
          person_id?: string
          staff_type_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_assign_staff_type_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_assign_staff_type_staff_type_id_fkey"
            columns: ["staff_type_id"]
            isOneToOne: false
            referencedRelation: "app_user_staff_types"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_status: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          new_status: string | null
          old_status: string | null
          person_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          new_status?: string | null
          old_status?: string | null
          person_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          new_status?: string | null
          old_status?: string | null
          person_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_assign_status_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people_assign_user_role: {
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
            foreignKeyName: "people_assign_user_role_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_assign_user_role_user_role_id_fkey"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "app_user_roles"
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
      people_emergency: {
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
      people_referrals: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          person_id: string
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
          id?: string
          is_deleted?: boolean
          person_id: string
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
          id?: string
          is_deleted?: boolean
          person_id?: string
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
          {
            foreignKeyName: "fk_people_referrals_person_id"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_appointment_attendees: {
        Row: {
          appointment_id: string
          attendee_id: string
          created_at: string
          created_by: string
          id: string
          removed_at: string | null
          removed_by: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          appointment_id: string
          attendee_id: string
          created_at?: string
          created_by: string
          id?: string
          removed_at?: string | null
          removed_by?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          appointment_id?: string
          attendee_id?: string
          created_at?: string
          created_by?: string
          id?: string
          removed_at?: string | null
          removed_by?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_appointment_attendees_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_attendees_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_attendees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_attendees_removed_by_fkey"
            columns: ["removed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_attendees_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_appointment_notes: {
        Row: {
          appointment_id: string
          appointment_note: string | null
          call_log_1: string | null
          call_log_2: string | null
          call_log_3: string | null
          created_at: string
          id: string
          person_id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          appointment_note?: string | null
          call_log_1?: string | null
          call_log_2?: string | null
          call_log_3?: string | null
          created_at?: string
          id?: string
          person_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          appointment_note?: string | null
          call_log_1?: string | null
          call_log_2?: string | null
          call_log_3?: string | null
          created_at?: string
          id?: string
          person_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_appointment_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_notes_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_appointment_outcomes_log: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          outcome: string | null
          person_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          outcome?: string | null
          person_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          outcome?: string | null
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_appointment_outcomes_log_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_outcomes_log_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_appointment_trigger_log: {
        Row: {
          appointment_id: string | null
          created_at: string
          event_source: string
          id: string
          raw_event_payload: Json
          trigger_event: string
          triggered_by_user_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          event_source: string
          id?: string
          raw_event_payload: Json
          trigger_event: string
          triggered_by_user_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          event_source?: string
          id?: string
          raw_event_payload?: Json
          trigger_event?: string
          triggered_by_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_appointment_trigger_log_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointment_trigger_log_triggered_by_user_id_fkey"
            columns: ["triggered_by_user_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_appointments: {
        Row: {
          agency_id: string
          appointment_status: string
          appointment_type: string | null
          booking_details: Json
          cal_booking_id: string | null
          calendar_owner_id: string
          canceled_at: string | null
          canceled_by: string | null
          canceled_by_email: string | null
          cancellation_reason: string | null
          created_at: string
          created_by: string
          end_time: string
          id: string
          location: string
          location_details: string | null
          rejection_reason: string | null
          reschedule_id: string | null
          rescheduled_by_email: string | null
          start_time: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          agency_id: string
          appointment_status?: string
          appointment_type?: string | null
          booking_details: Json
          cal_booking_id?: string | null
          calendar_owner_id: string
          canceled_at?: string | null
          canceled_by?: string | null
          canceled_by_email?: string | null
          cancellation_reason?: string | null
          created_at?: string
          created_by: string
          end_time: string
          id?: string
          location: string
          location_details?: string | null
          rejection_reason?: string | null
          reschedule_id?: string | null
          rescheduled_by_email?: string | null
          start_time: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          agency_id?: string
          appointment_status?: string
          appointment_type?: string | null
          booking_details?: Json
          cal_booking_id?: string | null
          calendar_owner_id?: string
          canceled_at?: string | null
          canceled_by?: string | null
          canceled_by_email?: string | null
          cancellation_reason?: string | null
          created_at?: string
          created_by?: string
          end_time?: string
          id?: string
          location?: string
          location_details?: string | null
          rejection_reason?: string | null
          reschedule_id?: string | null
          rescheduled_by_email?: string | null
          start_time?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_appointments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointments_calendar_owner_id_fkey"
            columns: ["calendar_owner_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointments_canceled_by_fkey"
            columns: ["canceled_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_appointments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_integrations_external: {
        Row: {
          category: string | null
          configuration: Json | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          service_provider: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          service_provider?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          service_provider?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      settings_integrations_webhooks: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          status: string
          updated_at: string
          updated_by: string | null
          webhook_api_endpoint: string
          webhook_api_secret: string
          webhook_description: string | null
          webhook_name: string
          webhook_type: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: string
          updated_at?: string
          updated_by?: string | null
          webhook_api_endpoint: string
          webhook_api_secret: string
          webhook_description?: string | null
          webhook_name: string
          webhook_type?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          status?: string
          updated_at?: string
          updated_by?: string | null
          webhook_api_endpoint?: string
          webhook_api_secret?: string
          webhook_description?: string | null
          webhook_name?: string
          webhook_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_integrations_webhooks_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_organization: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          country: string | null
          created_at: string
          created_by: string | null
          default_currency: string | null
          default_language: string | null
          default_timezone: string | null
          deleted_at: string | null
          deleted_by: string | null
          facebook_url: string | null
          google_profile_url: string | null
          id: string
          instagram_url: string | null
          is_deleted: boolean
          linkedin_url: string | null
          organization_id: string
          organization_logo: string | null
          tiktok_url: string | null
          updated_at: string
          updated_by: string | null
          x_url: string | null
          youtube_url: string | null
          zip_cone: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          default_currency?: string | null
          default_language?: string | null
          default_timezone?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          facebook_url?: string | null
          google_profile_url?: string | null
          id?: string
          instagram_url?: string | null
          is_deleted?: boolean
          linkedin_url?: string | null
          organization_id: string
          organization_logo?: string | null
          tiktok_url?: string | null
          updated_at?: string
          updated_by?: string | null
          x_url?: string | null
          youtube_url?: string | null
          zip_cone?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          default_currency?: string | null
          default_language?: string | null
          default_timezone?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          facebook_url?: string | null
          google_profile_url?: string | null
          id?: string
          instagram_url?: string | null
          is_deleted?: boolean
          linkedin_url?: string | null
          organization_id?: string
          organization_logo?: string | null
          tiktok_url?: string | null
          updated_at?: string
          updated_by?: string | null
          x_url?: string | null
          youtube_url?: string | null
          zip_cone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "app_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_organization_domains: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          domain: string | null
          id: string
          is_deleted: boolean
          organization_id: string
          protocol: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          domain?: string | null
          id?: string
          is_deleted?: boolean
          organization_id: string
          protocol?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          domain?: string | null
          id?: string
          is_deleted?: boolean
          organization_id?: string
          protocol?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_organization_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "app_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_services_and_fees: {
        Row: {
          agency_id: string
          billed_fee_type: Database["public"]["Enums"]["service_fee_type_enum"]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          fee_billed: string | null
          fee_payout: string | null
          id: string
          is_deleted: boolean
          payout_fee_type: string | null
          service: string | null
          service_category: Database["public"]["Enums"]["service_category_enum"]
          service_status: Database["public"]["Enums"]["service_status_enum"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_id: string
          billed_fee_type?: Database["public"]["Enums"]["service_fee_type_enum"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          fee_billed?: string | null
          fee_payout?: string | null
          id?: string
          is_deleted?: boolean
          payout_fee_type?: string | null
          service?: string | null
          service_category?: Database["public"]["Enums"]["service_category_enum"]
          service_status?: Database["public"]["Enums"]["service_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_id?: string
          billed_fee_type?: Database["public"]["Enums"]["service_fee_type_enum"]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          fee_billed?: string | null
          fee_payout?: string | null
          id?: string
          is_deleted?: boolean
          payout_fee_type?: string | null
          service?: string | null
          service_category?: Database["public"]["Enums"]["service_category_enum"]
          service_status?: Database["public"]["Enums"]["service_status_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_services_and_fees_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_services_insurances: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          insurance_category: Database["public"]["Enums"]["insurance_category_enum"]
          insurance_provider: string | null
          insurance_status: Database["public"]["Enums"]["service_status_enum"]
          is_deleted: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          insurance_category?: Database["public"]["Enums"]["insurance_category_enum"]
          insurance_provider?: string | null
          insurance_status?: Database["public"]["Enums"]["service_status_enum"]
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          insurance_category?: Database["public"]["Enums"]["insurance_category_enum"]
          insurance_provider?: string | null
          insurance_status?: Database["public"]["Enums"]["service_status_enum"]
          is_deleted?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_services_insurances_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "app_agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_data_label: {
        Args: {
          p_font_weight: string
          p_label_category: string
          p_label_color: string
          p_label_name: string
          p_text_color: string
        }
        Returns: Json
      }
      add_permission: {
        Args: { p_permission_name: string }
        Returns: Json
      }
      add_program_with_goals: {
        Args: { p_goals: Json; p_program_name: string }
        Returns: Json
      }
      add_staff_type: {
        Args: { p_staff_type: string; p_staff_type_label_id?: string }
        Returns: Json
      }
      add_user_role: {
        Args:
          | { p_role_label_id?: string; p_role_name: string }
          | { p_role_name: string }
        Returns: Json
      }
      create_agency_with_admin: {
        Args: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          agency_name: string
          agency_state: string
          agency_status?: Database["public"]["Enums"]["agency_status_enum"]
          created_by_user_id: string
        }
        Returns: Json
      }
      current_user_agency_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_app_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_has_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_has_agency_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_has_permission: {
        Args: { p_permission: string }
        Returns: boolean
      }
      current_user_is_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_permissions: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      current_user_person_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      delete_data_label: {
        Args: { p_label_id: string }
        Returns: Json
      }
      delete_people_additional_field: {
        Args: { p_field_name: string; p_person_id: string }
        Returns: Json
      }
      delete_people_contact_field: {
        Args: { p_field_name: string; p_person_id: string }
        Returns: Json
      }
      delete_people_emergency_field: {
        Args: { p_field_name: string; p_person_id: string }
        Returns: Json
      }
      delete_permission: {
        Args: { p_permission_id: string }
        Returns: Json
      }
      delete_program_with_goals: {
        Args: { p_program_id: string }
        Returns: Json
      }
      delete_staff_type: {
        Args: { p_staff_type_id: string }
        Returns: Json
      }
      delete_user_role: {
        Args: { p_role_id: string }
        Returns: Json
      }
      get_active_clients_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          first_name: string
          last_name: string
          person_id: string
          phone: string
          status: string
        }[]
      }
      get_active_staff_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          first_name: string
          last_name: string
          person_id: string
          phone: string
          status: string
        }[]
      }
      get_agencies_with_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          admins: Json
          agency_name: string
          agency_state: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["agency_status_enum"]
          storage_used: string
          user_count: number
        }[]
      }
      get_all_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          permission_name: string
          updated_at: string
        }[]
      }
      get_data_labels: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_leads_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          expectation: string
          first_name: string
          last_name: string
          lead_goals: string
          lead_id: string
          note: string
          person_id: string
          phone: string
          preferences: string
          status: string
        }[]
      }
      get_mailerlite_event_summary: {
        Args: {
          p_agency_id?: string
          p_end_date?: string
          p_start_date?: string
        }
        Returns: {
          event_type: string
          matched_subscribers: number
          total_events: number
          unmatched_subscribers: number
        }[]
      }
      get_organization_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_people_with_primary_contact: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          first_name: string
          id: string
          last_name: string
          middle_name: string
          phone: string
        }[]
      }
      get_permissions_with_assignments: {
        Args: { p_role_id: string }
        Returns: {
          assigned: boolean
          id: string
          permission_name: string
        }[]
      }
      get_permissions_with_assignments_for_staff_type: {
        Args: { p_staff_type_id: string }
        Returns: {
          assigned: boolean
          id: string
          permission_name: string
        }[]
      }
      get_personal_profile: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_primary_org_domain: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_programs_with_goals: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_staff_types_with_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          created_at: string
          font_weight: string
          id: string
          is_deleted: boolean
          label_color: string
          label_name: string
          staff_type: string
          staff_type_label_id: string
          text_color: string
          updated_at: string
        }[]
      }
      get_user_profile_data: {
        Args: { p_person_id: string }
        Returns: Json
      }
      get_user_roles_with_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          font_weight: string
          id: string
          label_color: string
          label_name: string
          permission_count: number
          role_label_id: string
          role_name: string
          text_color: string
          updated_at: string
          user_count: number
        }[]
      }
      link_user_to_person: {
        Args: { new_user_id: string; user_email: string }
        Returns: Json
      }
      save_organization_settings: {
        Args:
          | {
              p_address_line_1: string
              p_address_line_2: string
              p_country: string
              p_default_currency: string
              p_default_language: string
              p_default_timezone: string
              p_domains: Json
              p_facebook_url: string
              p_google_profile_url: string
              p_instagram_url: string
              p_linkedin_url: string
              p_organization_logo: string
              p_organization_name: string
              p_organization_state: string
              p_tiktok_url: string
              p_x_url: string
              p_youtube_url: string
              p_zip_cone: string
            }
          | {
              p_address_line_1: string
              p_address_line_2: string
              p_country: string
              p_default_currency: string
              p_default_language: string
              p_default_timezone: string
              p_domains: Json
              p_facebook_url: string
              p_google_profile_url: string
              p_instagram_url: string
              p_linkedin_url: string
              p_organization_name: string
              p_organization_state: string
              p_tiktok_url: string
              p_x_url: string
              p_youtube_url: string
              p_zip_cone: string
            }
        Returns: Json
      }
      set_role_permissions: {
        Args: { p_permission_ids: string[]; p_role_id: string }
        Returns: Json
      }
      set_staff_type_permissions: {
        Args: { p_permission_ids: string[]; p_staff_type_id: string }
        Returns: Json
      }
      soft_delete_agency: {
        Args: { agency_id: string; deleting_user_id: string }
        Returns: Json
      }
      update_agency_with_admin: {
        Args: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          agency_id: string
          agency_name: string
          agency_state: string
          agency_status: Database["public"]["Enums"]["agency_status_enum"]
          updated_by_user_id: string
        }
        Returns: Json
      }
      update_data_label: {
        Args: {
          p_font_weight: string
          p_label_category: string
          p_label_color: string
          p_label_id: string
          p_label_name: string
          p_text_color: string
        }
        Returns: Json
      }
      update_people_contact_address: {
        Args: {
          p_address_line_1: string
          p_address_line_2: string
          p_city: string
          p_person_id: string
          p_state: string
          p_zip_code: string
        }
        Returns: Json
      }
      update_people_contact_field: {
        Args: {
          p_field_name: string
          p_field_value: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_emergency_field: {
        Args: {
          p_field_name: string
          p_field_value: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_identifiers_field: {
        Args: {
          p_field_name: string
          p_field_value: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_leads_field: {
        Args: {
          p_field_name: string
          p_field_value: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_name_field: {
        Args: {
          p_first_name: string
          p_last_name: string
          p_middle_name: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_referrals_field: {
        Args: {
          p_field_name: string
          p_field_value: string
          p_person_id: string
        }
        Returns: Json
      }
      update_people_staff_type: {
        Args: { p_person_id: string; p_staff_type: string }
        Returns: Json
      }
      update_people_status: {
        Args: { p_person_id: string; p_status: string }
        Returns: Json
      }
      update_people_user_role: {
        Args: { p_person_id: string; p_role_name: string }
        Returns: Json
      }
      update_permission: {
        Args: { p_permission_id: string; p_permission_name: string }
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
          p_phone_home: string
          p_profile_pic: string
          p_state: string
          p_tiktok: string
          p_updated_by: string
          p_work_email: string
          p_zip_code: string
        }
        Returns: Json
      }
      update_program_with_goals: {
        Args: { p_goals: Json; p_program_id: string; p_program_name: string }
        Returns: Json
      }
      update_staff_type: {
        Args: {
          p_staff_type: string
          p_staff_type_id: string
          p_staff_type_label_id?: string
        }
        Returns: Json
      }
      update_user_role: {
        Args:
          | { p_role_id: string; p_role_label_id?: string; p_role_name: string }
          | { p_role_id: string; p_role_name: string }
        Returns: Json
      }
      user_can_access_agency: {
        Args: { target_agency_id: string }
        Returns: boolean
      }
    }
    Enums: {
      agency_status_enum: "active" | "inactive" | "deleted"
      emergency_relationship_enum:
        | "family member"
        | "colleague"
        | "friend"
        | "organization"
        | "other"
      insurance_category_enum: "medicaid" | "medicare" | "dual" | "private"
      organization_status_enum: "active" | "inactive" | "deleted"
      referral_relationship_enum:
        | "family member"
        | "colleague"
        | "friend"
        | "organization"
        | "other"
      referral_type_enum: "client" | "staff"
      service_category_enum: "adults" | "teens"
      service_fee_type_enum: "per hour" | "per session" | "per day" | "flat fee"
      service_status_enum: "active" | "inactive"
      staff_type_enum:
        | "specialist_marketer"
        | "clinical_assessor"
        | "clinical_supervisor"
        | "case_manager"
        | "admin_support"
        | "sales_rep"
        | "specialist_hr"
        | "specialist_it"
        | "specialist_finance"
        | "leadership_team_lead"
        | "leadership_exec"
      user_roles_enum:
        | "admin"
        | "owner"
        | "general"
        | "lead"
        | "staff"
        | "client"
        | "partner"
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
      agency_status_enum: ["active", "inactive", "deleted"],
      emergency_relationship_enum: [
        "family member",
        "colleague",
        "friend",
        "organization",
        "other",
      ],
      insurance_category_enum: ["medicaid", "medicare", "dual", "private"],
      organization_status_enum: ["active", "inactive", "deleted"],
      referral_relationship_enum: [
        "family member",
        "colleague",
        "friend",
        "organization",
        "other",
      ],
      referral_type_enum: ["client", "staff"],
      service_category_enum: ["adults", "teens"],
      service_fee_type_enum: ["per hour", "per session", "per day", "flat fee"],
      service_status_enum: ["active", "inactive"],
      staff_type_enum: [
        "specialist_marketer",
        "clinical_assessor",
        "clinical_supervisor",
        "case_manager",
        "admin_support",
        "sales_rep",
        "specialist_hr",
        "specialist_it",
        "specialist_finance",
        "leadership_team_lead",
        "leadership_exec",
      ],
      user_roles_enum: [
        "admin",
        "owner",
        "general",
        "lead",
        "staff",
        "client",
        "partner",
      ],
      user_status_enum: ["invited", "active", "inactive", "deleted"],
    },
  },
} as const
