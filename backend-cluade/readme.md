# 🏪 Multi-Project POS Management System (MVVM Architecture)

**Complete Point of Sale Backend - ایک account سے کتنی بھی supermarket manage کریں!**

## 📌 نیا اور بہتر Feature - Multi-Project System

Complete Point of Sale (POS) Backend System built with **Node.js**, **Express**, and **MongoDB** following **MVVM Architecture Pattern**.

### 🎯 اب آپ کر سکتے ہو:
```
✅ Main Supermarket - Karachi
✅ Branch - Lahore  
✅ Branch - Islamabad
```

ہر project **بالکل independent** ہے اپنے:
- Categories
- Products  
- Stock Management
- Sales/Transactions
- Team Members

### ✨ Key Features

- ✅ **Multi-Project Support** - ایک account سے متعدد supermarket
- ✅ **MVVM Architecture** - Clean separation of concerns
- ✅ **User Authentication** - JWT-based with role-based access
- ✅ **Project Management** - Create, Edit, Delete, Add team members
- ✅ **Product Management** - Full CRUD with pagination
- ✅ **Stock Management** - Track inventory movements (Add/Remove/Adjust)
- ✅ **Sales/Transactions** - Complete POS functionality with refunds
- ✅ **Reports & Analytics** - Daily, monthly, profit analysis
- ✅ **Low Stock Alerts** - Automatic notifications
- ✅ **Team Collaboration** - Add staff members to projects

---

## 🏗️ Project Structure (MVVM)

```
pos-backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/                       # MODEL Layer
│   │   ├── User.js
│   │   ├── Project.js              # NEW: Multi-Project System
│   │   ├── Product.js
│   │   ├── Stock.js
│   │   ├── Category.js
│   │   └── Transaction.js
│   ├── viewModels/                   # VIEWMODEL Layer
│   │   ├── AuthViewModel.js
│   │   ├── ProjectViewModel.js     # NEW: Project Management Logic
│   │   ├── ProductViewModel.js
│   │   ├── StockViewModel.js
│   │   ├── CategoryViewModel.js
│   │   ├── TransactionViewModel.js
│   │   └── ReportsViewModel.js
│   ├── views/                        # VIEW Layer (Routes)
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js        # NEW: Project Management Routes
│   │   ├── productRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── reportsRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Prerequisites

```bash
# Check if installed
node --version      # v16+ required
npm --version
mongod --version    # MongoDB
```

### 2. Install Dependencies

```bash
# Clone or create project
mkdir pos-backend-smit
cd pos-backend-smit

# Install packages
npm init -y
npm install express mongoose dotenv cors joi bcrypt jsonwebtoken
npm install --save-dev nodemon
```

### 3. Environment Setup

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pos_smit

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. Package.json Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 5. Start MongoDB

```bash
# Start MongoDB service
mongod

# Or on Linux/Mac with systemd:
sudo systemctl start mongod
```

### 6. Run Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### 🏷️ Categories

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| POST | `/api/categories` | Create category | Private |

### 📦 Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products (paginated) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| GET | `/api/products/low-stock` | Get low stock products | Public |
| POST | `/api/products` | Create product | Private |
| PUT | `/api/products/:id` | Update product | Private |
| DELETE | `/api/products/:id` | Delete product | Private |

### 📊 Stock Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/stock` | Get stock movements | Private |
| GET | `/api/stock/product/:id` | Get stock by product | Private |
| POST | `/api/stock/add` | Add stock (IN) | Private |
| POST | `/api/stock/remove` | Remove stock (OUT) | Private |
| POST | `/api/stock/adjust` | Adjust stock | Private |

### 💳 Transactions/Sales

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/transactions/sale` | Create sale | Private |
| GET | `/api/transactions` | Get all sales | Private |
| GET | `/api/transactions/:id` | Get single sale | Private |
| POST | `/api/transactions/:id/refund` | Refund sale | Admin/Manager |

### 📈 Reports & Analytics

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reports/daily/:date` | Daily sales report | Admin/Manager |
| GET | `/api/reports/top-selling` | Top selling products | Admin/Manager |
| GET | `/api/reports/profit` | Profit analysis | Admin/Manager |
| GET | `/api/reports/monthly/:year/:month` | Monthly summary | Admin/Manager |

---

## 🧪 Complete Testing Workflow

### Step 1: Register Admin User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@pos.com",
  "password": "admin123",
  "role": "ADMIN"
}

✅ Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Admin User",
      "email": "admin@pos.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Step 2: Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@pos.com",
  "password": "admin123"
}
```

**Save the token from response for next requests!**

### Step 3: Create Category

```http
POST http://localhost:5000/api/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}

✅ Save the category _id from response
```

### Step 4: Create Product

```http
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "sku": "SGS24-001",
  "description": "Latest Samsung flagship phone",
  "price": 125000,
  "costPrice": 100000,
  "category": "CATEGORY_ID_FROM_STEP_3",
  "quantity": 0,
  "minStockLevel": 5,
  "barcode": "SGS24001"
}

✅ Save the product _id from response
```

### Step 5: Add Stock

```http
POST http://localhost:5000/api/stock/add
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "productId": "PRODUCT_ID_FROM_STEP_4",
  "quantity": 50,
  "reason": "Initial Purchase",
  "performedBy": "Admin",
  "notes": "First batch from supplier"
}

✅ Now product quantity = 50
```

### Step 6: Create Sale (Transaction)

```http
POST http://localhost:5000/api/transactions/sale
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 2
    }
  ],
  "discount": 5000,
  "discountType": "FIXED",
  "paymentMethod": "CASH",
  "amountPaid": 250000,
  "customerName": "Ali Ahmed",
  "customerPhone": "03001234567",
  "notes": "Walk-in customer"
}

✅ Stock will automatically reduce by 2
✅ Transaction will be created with all calculations
```

### Step 7: Get Products with Pagination

```http
GET http://localhost:5000/api/products?page=1&limit=10&search=samsung
Authorization: Bearer YOUR_TOKEN_HERE

✅ Response includes pagination info
```

### Step 8: Check Low Stock

```http
GET http://localhost:5000/api/products/low-stock
Authorization: Bearer YOUR_TOKEN_HERE

✅ Returns products where quantity <= minStockLevel
```

### Step 9: Get Daily Report

```http
GET http://localhost:5000/api/reports/daily/2026-01-22
Authorization: Bearer YOUR_TOKEN_HERE

✅ Response:
{
  "success": true,
  "data": {
    "totalSales": 245000,
    "totalTransactions": 1,
    "totalDiscount": 5000,
    "totalTax": 44100,
    "cash": 245000,
    "card": 0,
    "upi": 0
  }
}
```

### Step 10: Get Top Selling Products

```http
GET http://localhost:5000/api/reports/top-selling?startDate=2026-01-01&endDate=2026-01-31&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎯 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to everything |
| **MANAGER** | Products, Stock, Sales, Reports (No user management) |
| **CASHIER** | Products (read), Sales (create/read) |
| **STAFF** | Products (read only) |

---

## 💾 Database Schema Overview

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum [ADMIN, MANAGER, CASHIER, STAFF],
  isActive: Boolean,
  lastLogin: Date
}
```

### Products
```javascript
{
  name: String,
  sku: String (unique),
  description: String,
  price: Number,
  costPrice: Number,
  category: ObjectId (ref: Category),
  quantity: Number,
  minStockLevel: Number,
  barcode: String,
  imageUrl: String,
  isActive: Boolean
}
```

### Stock Movements
```javascript
{
  product: ObjectId (ref: Product),
  type: Enum [IN, OUT, ADJUSTMENT],
  quantity: Number,
  reason: String,
  performedBy: String,
  notes: String,
  previousQuantity: Number,
  newQuantity: Number
}
```

### Transactions
```javascript
{
  transactionId: String (unique),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  discount: Number,
  tax: Number,
  totalAmount: Number,
  paymentMethod: Enum,
  performedBy: ObjectId (ref: User),
  status: Enum [COMPLETED, CANCELLED, REFUNDED]
}
```

---

## 🔥 Advanced Features

### 1. Automatic Stock Deduction on Sale
- When sale is created, stock automatically reduces
- Stock movement record is created
- If insufficient stock, sale is rejected

### 2. Transaction Rollback on Error
- Uses MongoDB transactions
- If any error occurs, entire operation rolls back
- Ensures data consistency

### 3. Soft Delete for Products
- Products are never hard deleted
- `isActive: false` marks as deleted
- Can be restored later

### 4. Profit Calculation
- Automatically calculates profit: `price - costPrice`
- Tracks profit margin percentage
- Monthly and yearly profit reports

### 5. Low Stock Alerts
- Automatic detection when `quantity <= minStockLevel`
- API endpoint to get all low stock products
- Can integrate email/SMS alerts

---

## 🛡️ Security Best Practices

1. **JWT Token Expiry**: Tokens expire in 7 days
2. **Password Hashing**: bcrypt with 10 salt rounds
3. **Role-Based Access**: Strict permission checks
4. **Input Validation**: Joi schema validation
5. **Error Handling**: Never expose sensitive info in errors
6. **CORS**: Configured for specific origins
7. **MongoDB Injection Prevention**: Mongoose sanitization

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
```bash
# Solution:
mongod  # Start MongoDB service
# Or check if already running:
sudo systemctl status mongod
```

### Issue 2: "Port 5000 already in use"
```bash
# Solution: Change port in .env
PORT=5001
```

### Issue 3: "Unauthorized" on protected routes
```bash
# Solution: Include Authorization header
Authorization: Bearer YOUR_JWT_TOKEN
```

### Issue 4: "Validation Error"
```bash
# Solution: Check request body matches schema
# Required fields: name, sku, price, costPrice, category
```

---

## 📚 Next Steps & Enhancements

1. **Add Excel/PDF Export** for reports
2. **Email Notifications** for low stock
3. **Barcode Scanner Integration**
4. **Multi-currency Support**
5. **Customer Management Module**
6. **Supplier Management**
7. **Purchase Orders**
8. **Inventory Audit Logs**
9. **Dashboard Statistics**
10. **Mobile App Integration**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit Pull Request

---

## 📞 Support

For issues or questions:
- Create GitHub issue
- Email: support@pos-smit.com

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

## 🙏 Acknowledgments

- SMIT Hackathon Team
- Node.js & Express Community
- MongoDB Documentation
- All Contributors

---

**Made with ❤️ for SMIT Hackathon**