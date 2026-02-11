
-- Create admin_emails table to store global admin emails
CREATE TABLE public.admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only company admins can manage this table
CREATE POLICY "Company admins can manage admin emails"
  ON public.admin_emails FOR ALL
  USING (public.is_company_admin(auth.uid()));

-- Anyone authenticated can read (needed for auto-detection)
CREATE POLICY "Authenticated users can view admin emails"
  ON public.admin_emails FOR SELECT
  USING (auth.role() = 'authenticated');

-- Update become_company_admin to also allow users whose email is in admin_emails
CREATE OR REPLACE FUNCTION public.become_company_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  _email text;
BEGIN
  -- Get caller's email
  SELECT email INTO _email FROM auth.users WHERE id = auth.uid();

  -- Check if caller is already a company admin
  IF EXISTS (SELECT 1 FROM public.company_admins WHERE user_id = auth.uid()) THEN
    RETURN; -- Already admin, just return silently
  END IF;

  -- Allow if no admin exists OR if caller's email is in admin_emails
  IF NOT EXISTS (SELECT 1 FROM public.company_admins LIMIT 1) 
     OR EXISTS (SELECT 1 FROM public.admin_emails WHERE admin_emails.email = _email) THEN
    INSERT INTO public.company_admins (user_id) VALUES (auth.uid());
  ELSE
    RAISE EXCEPTION 'Not authorized to become company admin';
  END IF;
END;
$$;
