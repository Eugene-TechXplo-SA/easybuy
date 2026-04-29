/*
  # Fix recursive RLS policy on user_profiles

  The "Admins can view all profiles" policies were self-referencing user_profiles
  to check is_admin, causing infinite recursion and returning null for all queries.

  Fix: drop the duplicate/broken policies and replace with a non-recursive version
  that reads is_admin from JWT app_metadata instead.
*/

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id)
    OR
    ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  );
