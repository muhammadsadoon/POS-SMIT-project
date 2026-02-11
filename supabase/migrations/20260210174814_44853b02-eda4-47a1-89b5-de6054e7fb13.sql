
-- Allow profiles to be searched by email (stored in auth.users)
-- Create a secure function to search users by name or email for member adding
CREATE OR REPLACE FUNCTION public.search_users_for_project(search_term text)
RETURNS TABLE(user_id uuid, full_name text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id as user_id, p.full_name, au.email::text
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  WHERE 
    au.email ILIKE '%' || search_term || '%'
    OR p.full_name ILIKE '%' || search_term || '%'
  LIMIT 10;
END;
$$;
