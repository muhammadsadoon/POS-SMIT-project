
-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can CRUD own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can CRUD own products" ON public.products;
DROP POLICY IF EXISTS "Users can CRUD own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can CRUD own sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Project members with roles
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'cashier',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Company admins table
CREATE TABLE public.company_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

-- Admin requests
CREATE TABLE public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  project_limit INTEGER NOT NULL DEFAULT 3,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- User project limits
CREATE TABLE public.user_project_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  max_projects INTEGER NOT NULL DEFAULT 3,
  assigned_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_project_limits ENABLE ROW LEVEL SECURITY;

-- Add project_id to existing tables
ALTER TABLE public.categories ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.sales ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Helper function: check if user is company admin
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.company_admins WHERE user_id = _user_id)
$$;

-- Helper function: check user's role in a project
CREATE OR REPLACE FUNCTION public.get_project_role(_user_id UUID, _project_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.project_members WHERE user_id = _user_id AND project_id = _project_id LIMIT 1
$$;

-- Helper function: check if user is member of project
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.project_members WHERE user_id = _user_id AND project_id = _project_id)
$$;

-- Helper function: count user's projects
CREATE OR REPLACE FUNCTION public.count_user_projects(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.projects WHERE owner_id = _user_id
$$;

-- Helper function: get user's project limit
CREATE OR REPLACE FUNCTION public.get_user_project_limit(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT max_projects FROM public.user_project_limits WHERE user_id = _user_id), 0)
$$;

-- RLS: Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS: Projects - owner and members can view
CREATE POLICY "Project members can view projects" ON public.projects FOR SELECT
  USING (owner_id = auth.uid() OR public.is_project_member(auth.uid(), id));
CREATE POLICY "Approved admins can create projects" ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id AND public.count_user_projects(auth.uid()) < public.get_user_project_limit(auth.uid()));
CREATE POLICY "Owner can update project" ON public.projects FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owner can delete project" ON public.projects FOR DELETE USING (owner_id = auth.uid());

-- RLS: Project members
CREATE POLICY "Members can view project members" ON public.project_members FOR SELECT
  USING (public.is_project_member(auth.uid(), project_id) OR EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));
CREATE POLICY "Admin/Manager can manage members" ON public.project_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );
CREATE POLICY "Admin can update members" ON public.project_members FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR public.get_project_role(auth.uid(), project_id) = 'admin'
  );
CREATE POLICY "Admin can delete members" ON public.project_members FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR public.get_project_role(auth.uid(), project_id) = 'admin'
  );

-- RLS: Categories - project scoped
CREATE POLICY "Project members can view categories" ON public.categories FOR SELECT
  USING (project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id));
CREATE POLICY "Admin/Manager can manage categories" ON public.categories FOR INSERT
  WITH CHECK (
    project_id IS NOT NULL AND auth.uid() = user_id
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );
CREATE POLICY "Admin/Manager can update categories" ON public.categories FOR UPDATE
  USING (
    project_id IS NOT NULL
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );
CREATE POLICY "Admin/Manager can delete categories" ON public.categories FOR DELETE
  USING (
    project_id IS NOT NULL
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );

-- RLS: Products - project scoped
CREATE POLICY "Project members can view products" ON public.products FOR SELECT
  USING (project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id));
CREATE POLICY "Admin/Manager can manage products" ON public.products FOR INSERT
  WITH CHECK (
    project_id IS NOT NULL AND auth.uid() = user_id
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );
CREATE POLICY "Admin/Manager can update products" ON public.products FOR UPDATE
  USING (
    project_id IS NOT NULL
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );
CREATE POLICY "Admin/Manager can delete products" ON public.products FOR DELETE
  USING (
    project_id IS NOT NULL
    AND public.get_project_role(auth.uid(), project_id) IN ('admin', 'manager')
  );

-- RLS: Sales - project scoped, cashiers can create
CREATE POLICY "Project members can view sales" ON public.sales FOR SELECT
  USING (project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id));
CREATE POLICY "Members can create sales" ON public.sales FOR INSERT
  WITH CHECK (project_id IS NOT NULL AND auth.uid() = user_id AND public.is_project_member(auth.uid(), project_id));

-- RLS: Sale items
CREATE POLICY "Members can view sale items" ON public.sale_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND public.is_project_member(auth.uid(), sales.project_id)));
CREATE POLICY "Members can create sale items" ON public.sale_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND public.is_project_member(auth.uid(), sales.project_id)));

-- RLS: Company admins
CREATE POLICY "Company admins can view all" ON public.company_admins FOR SELECT USING (public.is_company_admin(auth.uid()));
CREATE POLICY "Users can check own status" ON public.company_admins FOR SELECT USING (auth.uid() = user_id);

-- RLS: Admin requests
CREATE POLICY "Users can create own request" ON public.admin_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own request" ON public.admin_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Company admins can view all requests" ON public.admin_requests FOR SELECT USING (public.is_company_admin(auth.uid()));
CREATE POLICY "Company admins can update requests" ON public.admin_requests FOR UPDATE USING (public.is_company_admin(auth.uid()));

-- RLS: User project limits
CREATE POLICY "Users can view own limit" ON public.user_project_limits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Company admins can manage limits" ON public.user_project_limits FOR ALL USING (public.is_company_admin(auth.uid()));

-- RLS: User roles (keep view only)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for admin_requests updated_at  
CREATE TRIGGER update_admin_requests_updated_at BEFORE UPDATE ON public.admin_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle admin request approval (creates limit entry)
CREATE OR REPLACE FUNCTION public.approve_admin_request(_request_id UUID, _project_limit INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- Check caller is company admin
  IF NOT public.is_company_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT user_id INTO _user_id FROM public.admin_requests WHERE id = _request_id;
  
  UPDATE public.admin_requests SET status = 'approved', project_limit = _project_limit, reviewed_by = auth.uid() WHERE id = _request_id;
  
  INSERT INTO public.user_project_limits (user_id, max_projects, assigned_by)
  VALUES (_user_id, _project_limit, auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET max_projects = _project_limit, assigned_by = auth.uid();
END;
$$;

-- Function: update stock after sale
CREATE OR REPLACE FUNCTION public.update_stock_after_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER after_sale_item_insert AFTER INSERT ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_after_sale();
