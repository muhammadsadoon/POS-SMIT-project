# TODO List for Project Filtering and Layout Fix

## Task 1: Filter Projects Based on User Membership
- [x] Modify `app/dashboard/page.jsx` to filter projects where the current user is a member
- [x] Modify `app/projects/page.jsx` to filter projects where the current user is a member
- [x] Use `useAuth` hook to get current user ID
- [x] Fetch project members for each project and check if user ID matches

## Task 2: Fix Header/Navbar in Dashboard Layout
- [x] Read and analyze `components/ui/dashboard-layout.jsx`
- [x] Identify why header/navbar is not showing
- [x] Fix the layout to properly display header/navbar

## Task 3: Testing and Verification
- [ ] Test the project filtering logic
- [ ] Test the layout fix
- [ ] Ensure no breaking changes
