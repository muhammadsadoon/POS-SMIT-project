# Project Fixes and Features - TODO

## Completed Tasks

### 1. Role Management System
- [x] Changed default signup role from 'admin' to 'staff' in auth-store.ts
- [x] Created settings page at /dashboard/settings with role switching functionality
- [x] Settings page allows users to switch between 'staff' and 'admin' roles
- [x] Settings link already exists in dashboard layout user menu

### 2. UI Consistency Fixes
- [x] Replaced plain HTML buttons with Mantine Button components in dashboard/page.tsx
- [x] Updated button colors to use Mantine color scheme (blue, green, violet)
- [x] Maintained consistent styling across the dashboard

### 3. Project Structure
- [x] Verified dashboard layout includes settings navigation
- [x] Settings page is properly integrated with authentication and role management

## Followup Steps
- [ ] Test the application by running `npm run dev` or `pnpm dev`
- [ ] Verify signup creates users with 'staff' role by default
- [ ] Test role switching in settings page
- [ ] Ensure no linting errors in modified files
- [ ] Check that all navigation works correctly

## Notes
- The project uses pnpm for package management (pnpm-lock.yaml present)
- Next.js 16.1.6 with Turbopack
- Mantine UI components for consistent design
- Firebase for authentication and Firestore for data storage
