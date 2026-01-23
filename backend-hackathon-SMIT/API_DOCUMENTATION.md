
# 📊 Multi-Project POS Management System - API Documentation

## اپنی Supermarket Project بنائیں اور Manage کریں

---

## 🚀 PROJECT MANAGEMENT ENDPOINTS

### 1. تمام Projects حاصل کریں
```
GET /api/projects?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### 2. نیا Project بنائیں
```
POST /api/projects
Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Main Supermarket - Karachi",
  "description": "Main branch in Karachi",
  "location": "Tariq Road, Karachi",
  "phone": "03001234567",
  "email": "manager@supermart.com",
  "currency": "PKR",
  "taxRate": 17,
  "settings": {
    "lowStockAlert": 10,
    "autoBackup": true
  }
}
```

### 3. ایک Project کی Details دیکھیں
```
GET /api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN
```

### 4. Project کو Edit کریں
```
PUT /api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Updated Name",
  "taxRate": 20,
  "location": "New Location"
}
```

### 5. Project Delete کریں
```
DELETE /api/projects/PROJECT_ID
Authorization: Bearer YOUR_TOKEN
```

### 6. Team Member شامل کریں
```
POST /api/projects/PROJECT_ID/members
Authorization: Bearer YOUR_TOKEN

Body:
{
  "email": "staff@example.com",
  "role": "STAFF"  // OWNER, MANAGER, STAFF
}
```

### 7. Team Member نکالیں
```
DELETE /api/projects/PROJECT_ID/members/MEMBER_ID
Authorization: Bearer YOUR_TOKEN
```

---

## 📦 CATEGORY ENDPOINTS (Project-Specific)

### 1. Categories بنائیں
```
POST /api/projects/:projectId/categories
Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Grocery",
  "description": "Grocery items"
}
```

### 2. Categories دیکھیں
```
GET /api/projects/:projectId/categories
Authorization: Bearer YOUR_TOKEN
```

---

## 🛍️ PRODUCT ENDPOINTS (Project-Specific)

### 1. Products بنائیں
```
POST /api/projects/:projectId/products
Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Rice 10kg",
  "sku": "RICE-10",
  "description": "Basmati Rice",
  "price": 1500,
  "costPrice": 1200,
  "category": "CATEGORY_ID",
  "quantity": 0,
  "minStockLevel": 5,
  "barcode": "123456789"
}
```

### 2. Products دیکھیں
```
GET /api/projects/:projectId/products?page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

### 3. Product Edit کریں
```
PUT /api/projects/:projectId/products/PRODUCT_ID
Authorization: Bearer YOUR_TOKEN
```

---

## 📊 STOCK MANAGEMENT (Project-Specific)

### 1. Stock شامل کریں
```
POST /api/projects/:projectId/stock/add
Authorization: Bearer YOUR_TOKEN

Body:
{
  "productId": "PRODUCT_ID",
  "quantity": 50,
  "reason": "Bulk Purchase",
  "performedBy": "Admin",
  "notes": "Supplier: XYZ"
}
```

### 2. Stock نکالیں
```
POST /api/projects/:projectId/stock/remove
Authorization: Bearer YOUR_TOKEN

Body:
{
  "productId": "PRODUCT_ID",
  "quantity": 5,
  "reason": "Damaged",
  "performedBy": "Staff"
}
```

### 3. Stock Adjust کریں
```
POST /api/projects/:projectId/stock/adjust
Authorization: Bearer YOUR_TOKEN

Body:
{
  "productId": "PRODUCT_ID",
  "newQuantity": 100,
  "reason": "Physical Count",
  "performedBy": "Manager"
}
```

---

## 💳 SALES/TRANSACTIONS (Project-Specific)

### 1. Sale Create کریں
```
POST /api/projects/:projectId/transactions/sale
Authorization: Bearer YOUR_TOKEN

Body:
{
  "items": [
    {
      "productId": "PRODUCT_ID_1",
      "quantity": 2
    },
    {
      "productId": "PRODUCT_ID_2",
      "quantity": 1
    }
  ],
  "discount": 500,
  "discountType": "FIXED",  // FIXED or PERCENTAGE
  "paymentMethod": "CASH",  // CASH, CARD, UPI
  "amountPaid": 5000,
  "customerName": "Ahmed Khan",
  "customerPhone": "03001234567"
}
```

### 2. Sales دیکھیں
```
GET /api/projects/:projectId/transactions?page=1&limit=20
Authorization: Bearer YOUR_TOKEN
```

### 3. Sale Refund کریں
```
POST /api/projects/:projectId/transactions/TXN_ID/refund
Authorization: Bearer YOUR_TOKEN (Manager/Owner only)
```

---

## 📈 REPORTS (Project-Specific)

### 1. Daily Sales Report
```
GET /api/projects/:projectId/reports/daily/2026-01-23
Authorization: Bearer YOUR_TOKEN
```

### 2. Top Selling Products
```
GET /api/projects/:projectId/reports/top-selling?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer YOUR_TOKEN
```

### 3. Profit Analysis
```
GET /api/projects/:projectId/reports/profit?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 COMPLETE WORKFLOW مثال

### Step 1: Account بنائیں
```
POST /api/auth/register
{
  "name": "Owner Name",
  "email": "owner@supermart.com",
  "password": "secure_password",
  "role": "ADMIN"
}
```

### Step 2: Login کریں
```
POST /api/auth/login
{
  "email": "owner@supermart.com",
  "password": "secure_password"
}
// Token حاصل کریں
```

### Step 3: پہلا Project بنائیں
```
POST /api/projects
Headers: Authorization: Bearer TOKEN
{
  "name": "Branch 1 - Karachi",
  "location": "Tariq Road"
}
```

### Step 4: Category بنائیں
```
POST /api/projects/{projectId}/categories
{
  "name": "Vegetables"
}
```

### Step 5: Product بنائیں
```
POST /api/projects/{projectId}/products
{
  "name": "Tomatoes",
  "category": "{categoryId}",
  "price": 100,
  "costPrice": 80
}
```

### Step 6: Stock شامل کریں
```
POST /api/projects/{projectId}/stock/add
{
  "productId": "{productId}",
  "quantity": 100,
  "reason": "Initial Stock"
}
```

### Step 7: Sale بنائیں
```
POST /api/projects/{projectId}/transactions/sale
{
  "items": [{"productId": "{productId}", "quantity": 5}],
  "paymentMethod": "CASH",
  "amountPaid": 600
}
```

### Step 8: Report دیکھیں
```
GET /api/projects/{projectId}/reports/daily/2026-01-23
```

---

## ✨ فوائد

✅ **متعدد Projects** - ایک account سے کتنی بھی supermarket branches manage کریں
✅ **Complete Stock Management** - Stock in/out/adjust
✅ **Sales Tracking** - تمام sales record رہتے ہیں
✅ **Team Collaboration** - Staff members شامل کریں
✅ **Reports & Analytics** - Daily sales, profit analysis
✅ **Real-time Updates** - فوری inventory updates

---

**Happy Selling! 🛒**
