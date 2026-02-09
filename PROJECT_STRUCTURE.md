# Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── cloudinary/           # Cloudinary delete endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                 # Dashboard pages
│   │   ├── page.tsx              # Main dashboard
│   │   ├── projects/             # Projects management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── products/     # Products management
│   │   │       ├── members/      # Members management
│   │   │       └── sales/        # Sales dashboard
│   ├── staff/                    # Staff POS panel
│   ├── about/                     # About page
│   ├── pricing/                   # Pricing page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── components/                    # React components
│   ├── auth/                      # Auth components
│   │   └── auth-guard.tsx
│   ├── layouts/                   # Layout components
│   │   ├── dashboard-layout.tsx
│   │   └── page-transition-wrapper.tsx
│   ├── products/                  # Product components
│   │   ├── image-upload.tsx      # Cloudinary image upload
│   │   └── product-charts.tsx     # Analytics charts
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── providers.tsx              # App providers
│
├── lib/                           # Utilities and libraries
│   ├── firebase.ts                # Firebase configuration
│   ├── cloudinary.ts              # Cloudinary utilities
│   ├── firestore/                 # Firestore CRUD operations
│   │   ├── projects.ts
│   │   ├── products.ts
│   │   └── sales.ts
│   ├── auth/                      # Auth utilities
│   │   └── guards.ts
│   ├── animations/                 # GSAP animations
│   │   └── page-transitions.ts
│   └── utils/                     # General utilities
│
├── store/                         # State management
│   ├── zustand/                   # Zustand stores (primary)
│   │   ├── auth-store.ts
│   │   └── app-store.ts
│   └── reducers/                  # Redux (legacy, optional)
│
├── types/                         # TypeScript types
│   └── index.ts
│
├── config.json                    # Root configuration (Firebase, Cloudinary)
├── config.example.json            # Configuration template
├── firestore.rules                # Firestore security rules
├── components.json                # shadcn/ui configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Key Files

### Configuration
- `config.json` - Main configuration file (Firebase, Cloudinary)
- `config.example.json` - Template for configuration
- `firestore.rules` - Firestore security rules

### Core Features
- `lib/firebase.ts` - Firebase initialization (reads from config.json)
- `lib/cloudinary.ts` - Cloudinary image operations
- `components/products/image-upload.tsx` - Image upload component
- `components/products/product-charts.tsx` - Analytics charts

### State Management
- `store/zustand/auth-store.ts` - Authentication state (primary)
- `store/zustand/app-store.ts` - App state (projects, etc.)
- `store/reducers/` - Redux code (legacy, can be removed)

### Pages
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/dashboard` - Main dashboard
- `/dashboard/projects` - Projects list
- `/dashboard/projects/[id]/products` - Products management
- `/dashboard/projects/[id]/members` - Members management
- `/dashboard/projects/[id]/sales` - Sales dashboard
- `/staff` - POS panel
