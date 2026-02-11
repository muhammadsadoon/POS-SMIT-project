
CREATE OR REPLACE FUNCTION public.become_company_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if any company admin already exists
  IF EXISTS (SELECT 1 FROM public.company_admins LIMIT 1) THEN
    RAISE EXCEPTION 'Company admin already exists';
  END IF;

  -- Make the calling user the company admin
  INSERT INTO public.company_admins (user_id) VALUES (auth.uid());
END;
$$;
