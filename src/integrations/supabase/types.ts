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
      contacts: {
        Row: {
          company: string | null
          contactid: string
          createdat: string
          email: string | null
          firstname: string
          importedby: string | null
          isclient: boolean
          lastname: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          contactid?: string
          createdat?: string
          email?: string | null
          firstname: string
          importedby?: string | null
          isclient?: boolean
          lastname: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          contactid?: string
          createdat?: string
          email?: string | null
          firstname?: string
          importedby?: string | null
          isclient?: boolean
          lastname?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_importedby_fkey"
            columns: ["importedby"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      deals: {
        Row: {
          contactid: string | null
          createdat: string
          dealid: string
          dealtitle: string
          dealvalue: number | null
          lostat: string | null
          lostreason: string | null
          ownerid: string | null
          pipelineid: string
          stageid: string
          status: Database["public"]["Enums"]["deal_status"]
          wonat: string | null
        }
        Insert: {
          contactid?: string | null
          createdat?: string
          dealid?: string
          dealtitle: string
          dealvalue?: number | null
          lostat?: string | null
          lostreason?: string | null
          ownerid?: string | null
          pipelineid: string
          stageid: string
          status?: Database["public"]["Enums"]["deal_status"]
          wonat?: string | null
        }
        Update: {
          contactid?: string | null
          createdat?: string
          dealid?: string
          dealtitle?: string
          dealvalue?: number | null
          lostat?: string | null
          lostreason?: string | null
          ownerid?: string | null
          pipelineid?: string
          stageid?: string
          status?: Database["public"]["Enums"]["deal_status"]
          wonat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contactid_fkey"
            columns: ["contactid"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["contactid"]
          },
          {
            foreignKeyName: "deals_ownerid_fkey"
            columns: ["ownerid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
          {
            foreignKeyName: "deals_pipelineid_fkey"
            columns: ["pipelineid"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["pipelineid"]
          },
          {
            foreignKeyName: "deals_stageid_fkey"
            columns: ["stageid"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["stageid"]
          },
        ]
      }
      dealtags: {
        Row: {
          dealid: string
          tagid: string
        }
        Insert: {
          dealid: string
          tagid: string
        }
        Update: {
          dealid?: string
          tagid?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealtags_dealid_fkey"
            columns: ["dealid"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["dealid"]
          },
          {
            foreignKeyName: "dealtags_tagid_fkey"
            columns: ["tagid"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tagid"]
          },
        ]
      }
      expensecategories: {
        Row: {
          categoryid: string
          categoryname: string
          iseditable: boolean
        }
        Insert: {
          categoryid?: string
          categoryname: string
          iseditable?: boolean
        }
        Update: {
          categoryid?: string
          categoryname?: string
          iseditable?: boolean
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          categoryid: string
          createdat: string
          description: string
          expensedate: string
          expenseid: string
          recordedby: string
        }
        Insert: {
          amount: number
          categoryid: string
          createdat?: string
          description: string
          expensedate: string
          expenseid?: string
          recordedby: string
        }
        Update: {
          amount?: number
          categoryid?: string
          createdat?: string
          description?: string
          expensedate?: string
          expenseid?: string
          recordedby?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_categoryid_fkey"
            columns: ["categoryid"]
            isOneToOne: false
            referencedRelation: "expensecategories"
            referencedColumns: ["categoryid"]
          },
          {
            foreignKeyName: "expenses_recordedby_fkey"
            columns: ["recordedby"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      funnels: {
        Row: {
          content: Json | null
          created_at: string
          id: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          createdat: string
          enddate: string
          goalid: string
          metric: Database["public"]["Enums"]["goal_metric"]
          startdate: string
          targetteam: string | null
          targetuser: string | null
          targetvalue: number
        }
        Insert: {
          createdat?: string
          enddate: string
          goalid?: string
          metric: Database["public"]["Enums"]["goal_metric"]
          startdate: string
          targetteam?: string | null
          targetuser?: string | null
          targetvalue: number
        }
        Update: {
          createdat?: string
          enddate?: string
          goalid?: string
          metric?: Database["public"]["Enums"]["goal_metric"]
          startdate?: string
          targetteam?: string | null
          targetuser?: string | null
          targetvalue?: number
        }
        Relationships: [
          {
            foreignKeyName: "goals_targetteam_fkey"
            columns: ["targetteam"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["teamid"]
          },
          {
            foreignKeyName: "goals_targetuser_fkey"
            columns: ["targetuser"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      pipelines: {
        Row: {
          createdat: string
          iseditable: boolean
          pipelineid: string
          pipelinename: string
          pipelinetype: Database["public"]["Enums"]["pipeline_type"]
        }
        Insert: {
          createdat?: string
          iseditable?: boolean
          pipelineid?: string
          pipelinename: string
          pipelinetype: Database["public"]["Enums"]["pipeline_type"]
        }
        Update: {
          createdat?: string
          iseditable?: boolean
          pipelineid?: string
          pipelinename?: string
          pipelinetype?: Database["public"]["Enums"]["pipeline_type"]
        }
        Relationships: []
      }
      stages: {
        Row: {
          createdat: string
          pipelineid: string
          stageid: string
          stagename: string
          stageorder: number
        }
        Insert: {
          createdat?: string
          pipelineid: string
          stageid?: string
          stagename: string
          stageorder: number
        }
        Update: {
          createdat?: string
          pipelineid?: string
          stageid?: string
          stagename?: string
          stageorder?: number
        }
        Relationships: [
          {
            foreignKeyName: "stages_pipelineid_fkey"
            columns: ["pipelineid"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["pipelineid"]
          },
        ]
      }
      tags: {
        Row: {
          tagcolor: string
          tagid: string
          tagname: string
        }
        Insert: {
          tagcolor: string
          tagid?: string
          tagname: string
        }
        Update: {
          tagcolor?: string
          tagid?: string
          tagname?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          createdat: string
          ownerid: string | null
          teamid: string
          teamname: string
        }
        Insert: {
          createdat?: string
          ownerid?: string | null
          teamid?: string
          teamname: string
        }
        Update: {
          createdat?: string
          ownerid?: string | null
          teamid?: string
          teamname?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teams_owner"
            columns: ["ownerid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          },
        ]
      }
      users: {
        Row: {
          createdat: string
          email: string
          firstname: string
          lastname: string
          passwordhash: string
          profilepictureurl: string | null
          roleid: string | null
          teamid: string | null
          userid: string
        }
        Insert: {
          createdat?: string
          email: string
          firstname: string
          lastname: string
          passwordhash: string
          profilepictureurl?: string | null
          roleid?: string | null
          teamid?: string | null
          userid?: string
        }
        Update: {
          createdat?: string
          email?: string
          firstname?: string
          lastname?: string
          passwordhash?: string
          profilepictureurl?: string | null
          roleid?: string | null
          teamid?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["teamid"]
          },
        ]
      }
      webhooks: {
        Row: {
          createdat: string
          event: string
          isactive: boolean
          linkedpipelineid: string | null
          targeturl: string
          webhookid: string
          webhookname: string
        }
        Insert: {
          createdat?: string
          event: string
          isactive?: boolean
          linkedpipelineid?: string | null
          targeturl: string
          webhookid?: string
          webhookname: string
        }
        Update: {
          createdat?: string
          event?: string
          isactive?: boolean
          linkedpipelineid?: string | null
          targeturl?: string
          webhookid?: string
          webhookname?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_linkedpipelineid_fkey"
            columns: ["linkedpipelineid"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["pipelineid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      deal_status: "OPEN" | "WON" | "LOST"
      goal_metric: "REVENUE" | "DEALS_WON" | "APPOINTMENTS_SCHEDULED"
      pipeline_type: "PROSPECTING" | "SALES" | "POST_SALES"
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
      deal_status: ["OPEN", "WON", "LOST"],
      goal_metric: ["REVENUE", "DEALS_WON", "APPOINTMENTS_SCHEDULED"],
      pipeline_type: ["PROSPECTING", "SALES", "POST_SALES"],
    },
  },
} as const
