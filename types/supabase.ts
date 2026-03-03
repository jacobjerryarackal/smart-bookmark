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
          url: string;
          title: string;
          user_id?: string;   // optional, default will be set by DB
          created_at?: string; // optional, default now()
        };
        Update: {
          url?: string;
          title?: string;
        };
      };
    };
  };
}