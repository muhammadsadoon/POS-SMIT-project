# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Update `lib/firebase.ts` with your Firebase config
   - Enable Authentication (Email/Password) in Firebase Console
   - Enable Firestore Database

3. **Firestore Security Rules**
   - Copy `firestore.rules` content
   - Go to Firebase Console > Firestore Database > Rules
   - Paste and publish the rules

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## First User Setup

1. Sign up a new account at `/auth/signup`
2. The first user will be created as an `admin` by default
3. Create your first project from the dashboard
4. Add products to your project
5. Add team members and assign roles

## Testing the System

### Admin Flow
1. Login as admin
2. Create a new project
3. Add products (set password for each product)
4. Add members (managers/staff)
5. View sales dashboard

### Manager Flow
1. Login as manager (added by admin)
2. Access assigned projects
3. Manage products (requires product password)
4. View sales

### Staff Flow
1. Login as staff
2. Go to `/staff` POS panel
3. Select products and add to cart
4. Complete sales

## Important Notes

- Product passwords are required for update/delete operations
- Barcodes are auto-generated if not provided
- Sales are tracked in real-time
- Only live products with stock > 0 appear in POS
- Firestore rules enforce role-based access

## Troubleshooting

### Authentication Issues
- Check Firebase Auth is enabled
- Verify email/password provider is enabled
- Check browser console for errors

### Firestore Errors
- Verify security rules are deployed
- Check user role is set in Firestore `users` collection
- Ensure user is member of project

### Product Password Issues
- Passwords are hashed with bcrypt
- Original password is required for updates/deletes
- Minimum 4 characters required
