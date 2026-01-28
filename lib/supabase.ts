import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbSchedule {
  id: string;
  title: string;
  date: string;
  time_slots: { id: string; label: string }[];
  created_at: string;
  created_by: string;
}

export interface DbVote {
  id?: number;
  schedule_id: string;
  voter_id: string;
  voter_name: string;
  voter_email: string;
  time_slot_ids: string[];
  voted_at: string;
}
