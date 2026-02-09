# Changelog

## Latest Updates

### ✅ Added Features

1. **Root Configuration File (`config.json`)**
   - Centralized configuration for Firebase and Cloudinary
   - Easy to manage environment-specific settings
   - Example file (`config.example.json`) provided for setup

2. **Cloudinary Integration**
   - Product image upload, edit, and delete functionality
   - Image upload component with preview
   - Automatic image optimization
   - Secure image deletion via API route

3. **Product Analytics & Charts**
   - Stock levels bar chart
   - Live vs Draft pie chart
   - Stock status visualization
   - Inventory value calculation
   - Low stock and out-of-stock tracking

4. **Enhanced Product Management**
   - Image support for products
   - Visual product cards with images
   - Image display in POS system
   - Tabbed interface (Products / Analytics)

5. **shadcn/ui Components**
   - Button, Card, Input, Label, Select, Badge, Avatar, Dialog components
   - Modern, accessible UI components
   - Consistent design system

### 🔧 Improvements

- Updated Firebase config to use `config.json`
- Enhanced product type with `imageUrl` and `imagePublicId` fields
- Improved product cards with image display
- Better error handling for image operations
- Updated Firestore rules (already support imageUrl)

### 📝 Notes

- Redux Toolkit code remains for backward compatibility but Zustand is the primary state management
- Cloudinary credentials need to be added to `config.json`
- Product images are stored in Cloudinary's `products` folder

## Setup Instructions

1. Copy `config.example.json` to `config.json`
2. Fill in your Firebase credentials
3. Fill in your Cloudinary credentials:
   - Get Cloud Name, API Key, API Secret from Cloudinary Dashboard
   - Create an Upload Preset in Cloudinary Settings
4. Run `npm install` to install dependencies
5. Start development server: `npm run dev`
