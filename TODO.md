# TODO: Implement Default Project for Staff Users

## Tasks
- [ ] Add `setDefaultProjectForStaff` function to `store/zustand/app-store.ts`
- [ ] Update `app/staff/page.tsx` to call the function in useEffect if currentProject is null
- [ ] Test the implementation to ensure staff users can access sales page

## Details
- Function should fetch user projects and set the first one as currentProject
- Staff page should automatically set default project on load if none is set
