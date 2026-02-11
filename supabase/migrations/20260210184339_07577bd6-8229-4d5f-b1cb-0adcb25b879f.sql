
-- Drop the restrictive policy and recreate as permissive
DROP POLICY "Project members can view teammate profiles" ON public.profiles;
DROP POLICY "Users can view own profile" ON public.profiles;

-- Recreate both as PERMISSIVE (any one can pass)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Project members can view teammate profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_members pm1
    JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
    WHERE pm1.user_id = auth.uid() AND pm2.user_id = profiles.user_id
  )
);
