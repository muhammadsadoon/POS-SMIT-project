// ============================================
// src/server.js - COMPLETE SERVER
// ============================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import middlewares
const errorHandler = require('./middleware/errorHandler');
const { authMiddleware, authorize } = require('./middleware/auth');

// Import routes
const authRoutes = require('./views/authRoutes');
const projectRoutes = require('./views/projectRoutes');
const productRoutes = require('./views/productRoutes');
const stockRoutes = require('./views/stockRoutes');
const categoryRoutes = require('./views/categoryRoutes');
const transactionRoutes = require('./views/transactionRoutes');
const reportsRoutes = require('./views/reportsRoutes');

const app = express();

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'POS Backend Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API Info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'POS Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      categories: '/api/categories',
      products: '/api/products',
      stock: '/api/stock',
      transactions: '/api/transactions',
      reports: '/api/reports'
    }
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Project routes (protected)
app.use('/api/projects', authMiddleware, projectRoutes);

// Category routes (public for GET, protected for others)
app.use('/api/categories', categoryRoutes);

// Product routes (protected)
app.use('/api/products', productRoutes);

// Stock routes (protected)
app.use('/api/stock', authMiddleware, stockRoutes);

// Transaction routes (protected)
app.use('/api/transactions', authMiddleware, transactionRoutes);

// Reports routes (protected - Admin/Manager only)
app.use('/api/reports', authMiddleware, authorize('ADMIN', 'MANAGER'), reportsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 POS Backend Server Started');
  console.log('='.repeat(50));
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`📡 API Info: http://localhost:${PORT}/api`);
  console.log('='.repeat(50) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

module.exports = app;


// ============================================
// SAMPLE API CALLS FOR TESTING
// ============================================

/*
1. REGISTER USER:
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@pos.com",
  "password": "admin123",
  "role": "ADMIN"
}

2. LOGIN:
POST http://localhost:5000/api/auth/login
{
  "email": "admin@pos.com",
  "password": "admin123"
}
// Response me token milega, use Bearer token as Authorization header

3. CREATE PROJECT (Supermarket):
POST http://localhost:5000/api/projects
Authorization: Bearer YOUR_TOKEN
{
  "name": "Main Supermarket - Karachi",
  "description": "Main branch",
  "location": "Tariq Road",
  "phone": "03001234567",
  "email": "manager@supermart.com",
  "currency": "PKR",
  "taxRate": 17
}

4. GET ALL PROJECTS:
GET http://localhost:5000/api/projects?page=1&limit=10
Authorization: Bearer YOUR_TOKEN

5. UPDATE PROJECT:
PUT http://localhost:5000/api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN
{
  "name": "Updated Name",
  "taxRate": 20
}

6. ADD TEAM MEMBER:
POST http://localhost:5000/api/projects/PROJECT_ID/members
Authorization: Bearer YOUR_TOKEN
{
  "email": "staff@example.com",
  "role": "STAFF"
}

7. CREATE CATEGORY:
POST http://localhost:5000/api/categories
Authorization: Bearer YOUR_TOKEN
{
  "project": "PROJECT_ID",
  "name": "Grocery",
  "description": "Grocery items"
}

8. CREATE PRODUCT:
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN
{
  "project": "PROJECT_ID",
  "name": "Rice 10kg",
  "sku": "RICE-10",
  "description": "Basmati Rice",
  "price": 1500,
  "costPrice": 1200,
  "category": "CATEGORY_ID",
  "quantity": 0,
  "minStockLevel": 5,
  "barcode": "12345"
}

9. ADD STOCK:
POST http://localhost:5000/api/stock/add
Authorization: Bearer YOUR_TOKEN
{
  "project": "PROJECT_ID",
  "productId": "PRODUCT_ID",
  "quantity": 50,
  "reason": "Bulk Purchase",
  "performedBy": "Admin",
  "notes": "First batch"
}

10. REMOVE STOCK:
POST http://localhost:5000/api/stock/remove
Authorization: Bearer YOUR_TOKEN
{
  "project": "PROJECT_ID",
  "productId": "PRODUCT_ID",
  "quantity": 5,
  "reason": "Damaged",
  "performedBy": "Staff"
}

11. CREATE SALE:
POST http://localhost:5000/api/transactions/sale
Authorization: Bearer YOUR_TOKEN
{
  "project": "PROJECT_ID",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 2
    }
  ],
  "discount": 500,
  "discountType": "FIXED",
  "paymentMethod": "CASH",
  "amountPaid": 5000,
  "customerName": "John Doe",
  "customerPhone": "03001234567"
}

12. GET DAILY REPORT:
GET http://localhost:5000/api/reports/daily/2026-01-23
Authorization: Bearer YOUR_TOKEN

13. GET TOP SELLING PRODUCTS:
GET http://localhost:5000/api/reports/top-selling?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer YOUR_TOKEN

14. GET PROFIT ANALYSIS:
GET http://localhost:5000/api/reports/profit?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer YOUR_TOKEN

15. REFUND SALE:
POST http://localhost:5000/api/transactions/TXN-ID/refund
Authorization: Bearer YOUR_TOKEN (Admin/Manager only)

16. DELETE PROJECT:
DELETE http://localhost:5000/api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN (Owner only)
*/