export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: number;
          user_id: string;
          url: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: never; // auto-generated
          user_id?: string; // will be set by default
          url: string;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: never;
          user_id?: never; // cannot change
          url?: string;
          title?: string;
          created_at?: never;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}