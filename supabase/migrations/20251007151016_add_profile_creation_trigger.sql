/*
  # Add automatic profile creation on user signup

  1. Changes
    - Creates a function to automatically create a profile when a new user signs up
    - Creates a trigger on auth.users that calls this function
    - Extracts username from user metadata and creates profile with default values

  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only creates profile if one doesn't already exist
    - Sets sensible defaults for all profile fields

  3. Default Values
    - level: 1
    - xp: 0
    - current_streak: 0
    - longest_streak: 0
    - difficulty_preference: 'beginner'
    - bio: empty string
    - avatar_url: null
*/

-- Function to create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
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
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url',
    1,
    0,
    0,
    0,
    CURRENT_DATE,
    'beginner',
    '',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
