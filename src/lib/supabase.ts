import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  difficulty_preference: string;
  bio: string;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimated_minutes: number;
  xp_reward: number;
  order_index: number;
  prerequisites: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  lesson_id: string | null;
  title: string;
  description: string;
  challenge_type: 'code' | 'quiz' | 'scenario';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: any;
  xp_reward: number;
  time_limit_minutes: number | null;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlock_condition: any;
  xp_bonus: number;
  created_at: string;
};

export type UserLessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  started_at: string;
  completed_at: string | null;
  time_spent_minutes: number;
};

export type UserChallengeAttempt = {
  id: string;
  user_id: string;
  challenge_id: string;
  score: number;
  passed: boolean;
  answer_data: any;
  time_taken_minutes: number;
  attempted_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
};
