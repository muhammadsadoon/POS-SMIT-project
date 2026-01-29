# POS/Inventory Management Dashboard Frontend

A modern, production-ready Point of Sale and Inventory Management system built with Next.js, Redux Toolkit, RTK Query, and Mantine UI.

## 🚀 Features

### 1️⃣ Authentication Flow
- **User Registration & Login** - Secure authentication with JWT tokens
- **Protected Routes** - Auth guards for private pages
- **Persistent Sessions** - Token stored in localStorage and Redux
- **Role-Based Access Control** - Admin, Manager, Staff roles

### 2️⃣ Project Management
- **Create Projects** - Set up new stores/locations
- **Project Dashboard** - Overview of all projects
- **Team Management** - Add members with specific roles
- **Role-Based Permissions** - Control who can do what

### 3️⃣ Product Management
- **Add Products** - Name, price, category, SKU
- **Auto-Generate Barcodes** - Or provide custom ones
- **Product Listing** - View all products with details
- **Edit/Delete** - Manage product inventory

### 4️⃣ Stock Management
- **Add Stock (IN)** - Increase inventory
- **Remove Stock (OUT)** - Decrease inventory
- **Adjust Stock** - Fine-tune quantities
- **Low Stock Alerts** - Track minimum quantities
- **Stock History** - View all transactions

### 5️⃣ Dashboard Analytics
- **Real-time Stats** - Product count, stock levels, sales
- **Quick Actions** - Fast access to common tasks
- **Recent Activity** - Last updates and changes

### 6️⃣ Reports (Extensible)
- **Sales Reports** - Framework ready
- **Inventory Reports** - Framework ready
- **Export Functionality** - Ready to implement

## 📋 Tech Stack

- **Next.js 16** - React framework with App Router
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching & caching
- **Mantine UI** - Modern component library
- **React Hook Form** - Form validation
- **Zod** - Schema validation
- **Tabler Icons** - Icon library
- **Axios** - HTTP client

## 🏗️ Project Structure

```
frontend-hackathon-SMIT/
├── app/
│   ├── auth/
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── dashboard/page.jsx
│   ├── projects/
│   │   ├── page.jsx
│   │   ├── new/page.jsx
│   │   └── [id]/members/page.jsx
│   ├── products/page.jsx
│   ├── stock/page.jsx
│   ├── reports/page.jsx
│   ├── settings/page.jsx
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── Providers.jsx
│   ├── layouts/
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.module.css
│   ├── ui/
│   │   └── dashboard-layout.jsx
│   ├── forms/
│   └── tables/
├── store/
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── projectSlice.js
│       ├── productSlice.js
│       └── stockSlice.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── projectService.js
│   ├── productService.js
│   └── stockService.js
├── lib/
│   ├── theme.js
│   ├── schemas.js
│   ├── constants.js
│   └── utilities.js
├── hooks/
│   └── useAuth.js
├── public/
├── package.json
├── next.config.mjs
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-hackathon-SMIT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your API endpoint:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## 🔑 Default Credentials (for testing)

These are examples - your backend will provide actual credentials.

```
Email: user@example.com
Password: password123
```

## 📖 Usage Guide

### Authentication
1. Go to `/auth/signup` to create an account
2. Login at `/auth/login`
3. JWT token is automatically stored
4. You're redirected to the dashboard

### Creating a Project
1. Click "New Project" in the Projects page
2. Enter project name and description
3. Follow the wizard to completion
4. Add team members with specific roles

### Managing Products
1. Go to "Products" in sidebar
2. Click "Add Product"
3. Fill in details (barcode auto-generates if left blank)
4. View all products in the table

### Stock Management
1. Go to "Stock" in sidebar
2. Use "Update Stock" to:
   - Add Stock (IN) - receive inventory
   - Remove Stock (OUT) - sell/remove items
   - Adjust - fine-tune quantities

### Team Management
1. Open a project
2. Go to "Members" tab
3. Add team members by email
4. Assign roles: Admin, Manager, or Staff

## 🔐 Role Permissions

### Admin
- Create and edit projects
- Manage all team members
- Access all reports
- Full inventory control

### Manager
- Edit project & products
- Manage inventory (add/remove/adjust)
- View reports
- Cannot delete projects

### Staff
- View-only access
- Cannot modify data
- View products and stock

## 🎨 UI/UX Features

- **Supabase-style Design** - Clean, minimal aesthetic
- **Dark Mode Ready** - Mantine provides theme switching
- **Responsive Design** - Works on mobile, tablet, desktop
- **Smooth Animations** - Professional transitions
- **Toast Notifications** - User feedback
- **Loading States** - Clear feedback during API calls
- **Error Handling** - User-friendly error messages

## 🔧 Redux Store Architecture

### Auth Slice
- `user` - Current user data
- `token` - JWT token
- `isAuthenticated` - Auth state
- `isLoading` - Loading state
- `error` - Error messages

### Project Slice
- `projects` - List of all projects
- `currentProject` - Selected project
- `isLoading` - Loading state
- `error` - Error messages

### Product Slice
- `products` - List of all products
- `currentProduct` - Selected product
- `isLoading` - Loading state
- `error` - Error messages

### Stock Slice
- `stocks` - List of all stock records
- `isLoading` - Loading state
- `error` - Error messages

## 🔌 API Integration

All API calls use RTK Query with automatic:
- Request/response caching
- Background refetching
- Error handling
- Token injection in headers

### Available Endpoints

```
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /projects
POST   /projects
PUT    /projects/:id
DELETE /projects/:id

GET    /projects/:id/members
POST   /projects/:id/members

GET    /products
POST   /products
PUT    /products/:id
DELETE /products/:id

GET    /stock
POST   /stock/add
POST   /stock/remove
POST   /stock/adjust
```

## 🎯 Form Validation

Using **React Hook Form + Zod** for:
- Real-time validation
- Type-safe schemas
- User-friendly error messages
- Client & server-side validation

### Validation Schemas
- `loginSchema` - Email & password
- `signupSchema` - Registration form
- `createProjectSchema` - Project creation
- `productSchema` - Product details
- `addStockSchema` - Stock transactions
- `memberSchema` - Team member roles

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📦 Dependencies Overview

| Package | Purpose |
|---------|---------|
| `@reduxjs/toolkit` | State management |
| `react-redux` | React bindings for Redux |
| `@mantine/core` | UI components |
| `react-hook-form` | Form handling |
| `zod` | Schema validation |
| `axios` | HTTP client |
| `dayjs` | Date formatting |
| `@tabler/icons-react` | Icons |

## 🐛 Debugging

### Redux DevTools
Install Redux DevTools browser extension to inspect state changes.

### Console Logging
Enable debug logs for API calls:
```javascript
// In services/api.js, uncomment console logs
```

### Network Requests
Use browser DevTools Network tab to inspect API calls.

## 🔄 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Update components
   - Add Redux actions
   - Create API endpoints

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Mantine Docs](https://mantine.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check existing issues in the repository
2. Create a detailed issue report
3. Include steps to reproduce
4. Provide error logs/screenshots

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** Active Development
