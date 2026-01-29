# POS/Inventory Management Dashboard

A production-ready Point of Sale and Inventory Management system frontend built with cutting-edge technologies.

## 🎉 Status: ✅ COMPLETE & READY

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed completion report.

## 🚀 Quick Start

**Get running in 3 commands:**

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

👉 **[Read the full Getting Started Guide →](./GETTING_STARTED.md)**

## 📦 What's Included

✅ **Complete Authentication** - Login, signup, role-based access  
✅ **Project Management** - Create & manage multiple projects  
✅ **Product Inventory** - Add products with auto-generated barcodes  
✅ **Stock Management** - Track IN/OUT/Adjust inventory  
✅ **Team Management** - Assign roles to team members  
✅ **Real-time Dashboard** - Analytics & quick stats  
✅ **Advanced Forms** - Validation with React Hook Form + Zod  
✅ **Beautiful UI** - Mantine components, Supabase-style design  

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **State** | Redux Toolkit + RTK Query |
| **UI** | Mantine Components |
| **Forms** | React Hook Form + Zod |
| **HTTP** | Axios |
| **Icons** | Tabler Icons |
| **Dates** | dayjs |

## 📖 Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Quick setup guide
- **[README_SETUP.md](./README_SETUP.md)** - Detailed documentation

## 🏗️ Architecture

```
Redux Store (Global State)
    ├── Auth (user, token, login state)
    ├── Projects (project CRUD)
    ├── Products (product CRUD)
    └── Stock (inventory tracking)
         ↓
RTK Query (API & Caching)
    ├── Auth Service
    ├── Projects Service
    ├── Products Service
    └── Stock Service
         ↓
React Components (UI Layer)
    ├── DashboardLayout (with Sidebar)
    ├── Auth Pages (Login/Signup)
    ├── Project Pages
    ├── Product Pages
    └── Stock Pages
```

## 📚 Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/auth/login` | User authentication |
| Signup | `/auth/signup` | User registration |
| Dashboard | `/dashboard` | Main overview |
| Projects | `/projects` | Project management |
| Products | `/products` | Product inventory |
| Stock | `/stock` | Stock management |
| Members | `/projects/[id]/members` | Team management |
| Reports | `/reports` | Analytics (framework) |
| Settings | `/settings` | App settings |

## 🔐 Role-Based Access

**Admin** - Full access  
**Manager** - Manage inventory & products  
**Staff** - View only  

## 🎨 Features

### Authentication
- Secure JWT-based login
- Persistent sessions
- Protected routes
- Auto token injection

### State Management
- Redux for app state
- RTK Query for API calls
- Automatic caching
- Error handling

### Forms & Validation
- Real-time validation
- Zod schemas
- User-friendly errors
- Auto-focusing

### UI/UX
- Supabase-style design
- Dark mode ready
- Responsive layout
- Toast notifications
- Loading states

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Update API URL (if needed)
# Edit .env.local - set NEXT_PUBLIC_API_URL

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Endpoints

Expected backend endpoints:
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
GET    /projects
POST   /projects
PUT    /projects/:id
DELETE /projects/:id
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

## 🏗️ Project Structure

```
app/                    # Next.js App Router pages
├── auth/               # Authentication pages
├── dashboard/          # Dashboard page
├── projects/           # Project management
├── products/           # Product management
└── stock/              # Stock management

store/                  # Redux store
├── index.js
└── slices/             # Redux slices

services/               # RTK Query services
├── authService.js
├── projectService.js
├── productService.js
└── stockService.js

components/             # React components
├── Providers.jsx
├── layouts/            # Layout components
├── forms/              # Form components
└── tables/             # Table components

lib/                    # Utilities
├── theme.js            # Mantine theme
├── schemas.js          # Zod schemas
└── constants.js        # App constants

hooks/                  # Custom hooks
└── useAuth.js
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t pos-dashboard .
docker run -p 3000:3000 pos-dashboard
```

### Manual
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

**Port in use?**
```bash
lsof -ti :3000 | xargs kill -9
npm run dev -- -p 3001
```

**API not responding?**
1. Check `.env.local` has correct API URL
2. Verify backend is running
3. Check network tab in DevTools

**State not updating?**
1. Check Redux DevTools
2. Verify action dispatches
3. Clear browser cache

**Build failing?**
1. Delete `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Try build again: `npm run build`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Mantine UI](https://mantine.dev/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Private & Proprietary

## 🆘 Support

For issues or questions:
1. Check [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Review [README_SETUP.md](./README_SETUP.md)
3. Check browser console for errors

---

Built with ❤️ for inventory management
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
