# Getting Started with POS Dashboard

This guide will help you set up and run the POS/Inventory Management Dashboard in 5 minutes.

## ⚡ Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

## 🔑 Authentication

### Test Account (if backend provides mock auth)
```
Email: test@example.com
Password: password123
```

### Sign Up
1. Go to `/auth/signup`
2. Create a new account
3. You'll be redirected to create your first project

## 🎯 First Steps After Login

### 1. Create a Project
- Click "Projects" in sidebar
- Click "New Project"
- Fill in project details
- Add team members

### 2. Add Products
- Go to "Products"
- Click "Add Product"
- Enter product details
- System auto-generates barcode

### 3. Manage Stock
- Go to "Stock"
- Click "Update Stock"
- Add/Remove/Adjust quantities

### 4. View Dashboard
- See real-time statistics
- View recent products
- Track stock levels

## 📁 Project Structure Quick Overview

```
/app                  # Next.js pages
  /auth              # Login/Signup pages
  /dashboard         # Dashboard page
  /projects          # Project management
  /products          # Product management
  /stock            # Stock management

/store               # Redux store
  /slices           # Redux slices (auth, project, etc)

/services            # RTK Query API services
  authService.js    # Auth API
  projectService.js # Project API
  productService.js # Product API
  stockService.js   # Stock API

/components          # React components
  /layouts          # Layout components
  Providers.jsx     # Redux & Mantine provider

/lib                 # Utilities
  schemas.js        # Zod validation schemas
  constants.js      # App constants
  theme.js          # Mantine theme
```

## 🔑 Key Features Explained

### Authentication
- Secure login/signup
- JWT token management
- Protected routes
- Auto-logout on 401

### State Management
- Redux for global state
- RTK Query for API data
- Automatic caching
- Token injection

### Form Validation
- React Hook Form
- Zod schemas
- Real-time validation
- User-friendly errors

### UI Components
- Mantine UI components
- Supabase-style design
- Dark mode ready
- Responsive layout

## 🚀 Available Routes

### Public Routes
- `/auth/login` - Login page
- `/auth/signup` - Registration page

### Protected Routes (Require Login)
- `/dashboard` - Main dashboard
- `/projects` - Projects list
- `/projects/new` - Create project
- `/projects/[id]/members` - Team members
- `/products` - Products list
- `/stock` - Stock management
- `/reports` - Reports
- `/settings` - Settings

## 🛠️ Common Tasks

### Add a New Page
1. Create `app/feature/page.jsx`
2. Use `<DashboardLayout>` wrapper
3. Add route to sidebar in `Sidebar.jsx`

### Add a New API Service
1. Create `services/featureService.js`
2. Use `createApi` from RTK Query
3. Add reducer to store in `store/index.js`

### Add a Form
1. Use `useForm` from react-hook-form
2. Define schema with zod in `lib/schemas.js`
3. Implement form component

### Make API Call
```javascript
import { useGetProductsQuery } from '@/services/productService';

function MyComponent() {
  const { data, isLoading, error } = useGetProductsQuery();
  
  return <div>{/* ... */}</div>;
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Environment Variables Not Loaded
1. Check `.env.local` exists
2. Restart dev server
3. Verify prefix `NEXT_PUBLIC_` for client-side vars

### Redux DevTools Not Working
1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. Restart browser
3. Check DevTools tab

### API Calls Failing (401)
1. Check token in localStorage
2. Verify API URL is correct in `.env.local`
3. Check backend is running

### TypeScript/Import Errors
1. Install dependencies: `npm install`
2. Clear `.next`: `rm -rf .next`
3. Restart dev server

## 📚 Next Steps

1. **Connect Backend** - Update API URLs in `services/`
2. **Add More Pages** - Create new routes as needed
3. **Customize Theme** - Modify `lib/theme.js`
4. **Add Features** - Extend components and services
5. **Deploy** - Use Vercel, Netlify, or your preferred platform

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📞 Need Help?

1. Check the [README_SETUP.md](./README_SETUP.md) for detailed docs
2. Review the component implementations
3. Check browser console for errors
4. Verify API connection and responses

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with API URL
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can navigate pages
- [ ] Backend API running (if using)

---

You're all set! 🎉 Start building your POS dashboard!
