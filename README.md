# Store Management System

A modern, full-stack SaaS-style Store Management System built with Next.js 14, Firebase, and TypeScript.

## Features

- **Multi-Store Management**: Create and manage multiple stores (projects) from a single dashboard
- **Role-Based Access Control**: Admin, Manager, and Staff roles with proper permissions
- **Product Management**: Add, edit, and delete products with password protection
- **Real-Time Sales Tracking**: Live sales monitoring with Firestore real-time listeners
- **POS System**: Mobile-first responsive Point of Sale interface for staff
- **Modern UI**: Built with Mantine UI and shadcn/ui components
- **Animations**: Smooth GSAP animations for page transitions and interactions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **UI**: Mantine + shadcn/ui + React Bits
- **Animations**: GSAP
- **Auth & Database**: Firebase Auth + Firestore
- **Forms & Validation**: React Hook Form + Zod
- **State Management**: Redux Toolkit + Zustand
- **Password Hashing**: bcryptjs
- **Image Management**: Cloudinary
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Saylani Hackathon Project FVP"
```

2. Install dependencies:
```bash
npm install
```

3. Set up Configuration:
   - Copy `config.example.json` to `config.json`
   - Fill in your Firebase credentials:
     - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
     - Enable Authentication (Email/Password)
     - Enable Firestore Database
     - Copy Firebase config to `config.json`
   - Fill in your Cloudinary credentials:
     - Sign up at [Cloudinary](https://cloudinary.com)
     - Get Cloud Name, API Key, and API Secret from Dashboard
     - Create an Upload Preset in Settings > Upload
     - Add credentials to `config.json`

4. Deploy Firestore Security Rules:
   - Copy the contents of `firestore.rules` to your Firebase Console
   - Go to Firestore Database > Rules and paste the rules

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── staff/                # Staff POS panel
│   ├── about/                # About page
│   └── pricing/              # Pricing page
├── components/               # React components
│   ├── auth/                 # Auth-related components
│   ├── layouts/              # Layout components
│   └── ui/                   # UI components
├── lib/                      # Utilities and libraries
│   ├── firebase.ts           # Firebase configuration
│   ├── firestore/            # Firestore CRUD operations
│   ├── auth/                 # Auth utilities
│   └── animations/           # GSAP animations
├── store/                    # State management
│   └── zustand/              # Zustand stores
├── types/                    # TypeScript type definitions
└── firestore.rules           # Firestore security rules
```

## User Roles

### Admin
- Full access to all features
- Create and manage projects
- Add/remove members
- Manage products
- View all sales

### Manager
- Manage products
- Add/remove members (staff only)
- View sales
- Cannot delete projects

### Staff
- View live products
- Perform sales via POS
- No access to product editing or member management

## Key Features

### Product Management
- Products require a password for update/delete operations
- Auto-generated barcodes if not provided
- Stock management
- Live/Draft status
- **Image upload/edit/delete via Cloudinary**
- **Product analytics with charts** (stock levels, inventory value, status breakdown)

### Sales System
- Real-time sales tracking
- Sales history per project
- Statistics and analytics

### Security
- Firestore security rules for role-based access
- Password-protected product operations
- Bcrypt password hashing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables if needed
4. Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## Future Enhancements

- Stripe integration for billing
- Advanced analytics dashboard
- Inventory alerts
- Multi-currency support
- Export reports (PDF/Excel)
- Mobile app (React Native)

## License

MIT License

## Author

Muhammad Sadoon
