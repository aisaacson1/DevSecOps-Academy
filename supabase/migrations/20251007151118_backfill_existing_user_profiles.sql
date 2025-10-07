/*
  # Backfill profiles for existing users

  1. Purpose
    - Creates profiles for any existing auth.users who don't have a profile yet
    - This handles users created before the automatic profile creation trigger was added

  2. Changes
    - Inserts profiles for all auth.users who don't have a corresponding profile
    - Uses same default values as the automatic trigger
    - Extracts username from user metadata or generates a default

  3. Safety
    - Uses INSERT ... ON CONFLICT DO NOTHING to avoid errors if profile already exists
    - Idempotent - can be run multiple times safely
*/

-- Backfill profiles for existing users
INSERT INTO public.profiles (
  id,
  username,
  avatar_url,
  level,
  xp,
  current_streak,
  longest_streak,
  last_activity_date,
  difficulty_preference,
  bio,
  created_at,
  updated_at
)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8)),
  u.raw_user_meta_data->>'avatar_url',
  1,
  0,
  0,
  0,
  CURRENT_DATE,
  'beginner',
  '',
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
