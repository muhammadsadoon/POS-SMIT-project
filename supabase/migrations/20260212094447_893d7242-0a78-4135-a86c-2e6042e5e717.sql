-- Add sale confirmation password column to projects table
ALTER TABLE public.projects ADD COLUMN sale_password text DEFAULT null;