
-- Drop old manager+admin delete policy and create admin-only delete policy
DROP POLICY "Admin/Manager can delete products" ON public.products;

CREATE POLICY "Admin can delete products"
ON public.products
FOR DELETE
USING (
  (project_id IS NOT NULL) AND (get_project_role(auth.uid(), project_id) = 'admin'::app_role)
);
