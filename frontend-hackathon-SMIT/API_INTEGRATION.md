# POS Dashboard - Backend Integration Guide

This document explains how to integrate the frontend with your backend API.

## 🔌 API Integration

### Base URL Configuration

The API base URL is set in your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Update this to match your backend URL.

### API Services Location

All API services are defined in `/services`:
- `authService.js` - Authentication endpoints
- `projectService.js` - Project management endpoints
- `productService.js` - Product endpoints
- `stockService.js` - Stock management endpoints

## 🔐 Authentication Flow

### 1. Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  "token": "jwt-token-here"
}
```

### 2. Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** (Same as register)

### 3. Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

## 📁 Projects API

### List Projects
**Endpoint:** `GET /projects`

**Response:**
```json
[
  {
    "id": "project-id",
    "name": "Store Name",
    "description": "Store description",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Project
**Endpoint:** `POST /projects`

**Request Body:**
```json
{
  "name": "New Store",
  "description": "Store description"
}
```

**Response:**
```json
{
  "id": "new-project-id",
  "name": "New Store",
  "description": "Store description",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Update Project
**Endpoint:** `PUT /projects/:id`

### Delete Project
**Endpoint:** `DELETE /projects/:id`

## 👥 Project Members API

### Get Project Members
**Endpoint:** `GET /projects/:projectId/members`

**Response:**
```json
[
  {
    "id": "member-id",
    "userId": "user-id",
    "projectId": "project-id",
    "role": "admin",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Add Project Member
**Endpoint:** `POST /projects/:projectId/members`

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "manager"
}
```

**Response:**
```json
{
  "id": "member-id",
  "userId": "user-id",
  "projectId": "project-id",
  "role": "manager",
  "user": {
    "id": "user-id",
    "name": "New Member",
    "email": "newmember@example.com"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## 📦 Products API

### List Products
**Endpoint:** `GET /products?projectId=:projectId`

**Response:**
```json
[
  {
    "id": "product-id",
    "projectId": "project-id",
    "name": "Product Name",
    "price": 99.99,
    "category": "electronics",
    "barcode": "123456789012",
    "sku": "PROD-001",
    "description": "Product description",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Product
**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "projectId": "project-id",
  "name": "New Product",
  "price": 49.99,
  "category": "electronics",
  "barcode": "123456789012",
  "sku": "PROD-002",
  "description": "Product description"
}
```

**Response:** (Created product object)

### Update Product
**Endpoint:** `PUT /products/:id`

**Request Body:** (Same fields as create)

### Delete Product
**Endpoint:** `DELETE /products/:id`

### Generate Barcode
**Endpoint:** `POST /products/barcode/generate`

**Request Body:**
```json
{
  "productId": "product-id"
}
```

**Response:**
```json
{
  "barcode": "987654321098"
}
```

## 📊 Stock API

### Get Stock
**Endpoint:** `GET /stock?projectId=:projectId`

**Response:**
```json
[
  {
    "id": "stock-id",
    "projectId": "project-id",
    "productId": "product-id",
    "quantity": 50,
    "minQuantity": 10,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Add Stock (IN)
**Endpoint:** `POST /stock/add`

**Request Body:**
```json
{
  "projectId": "project-id",
  "productId": "product-id",
  "quantity": 10,
  "notes": "Received from supplier"
}
```

**Response:**
```json
{
  "id": "stock-id",
  "projectId": "project-id",
  "productId": "product-id",
  "quantity": 60,
  "minQuantity": 10,
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### Remove Stock (OUT)
**Endpoint:** `POST /stock/remove`

**Request Body:**
```json
{
  "projectId": "project-id",
  "productId": "product-id",
  "quantity": 5,
  "notes": "Sold to customer"
}
```

**Response:** (Updated stock object)

### Adjust Stock
**Endpoint:** `POST /stock/adjust`

**Request Body:**
```json
{
  "projectId": "project-id",
  "productId": "product-id",
  "quantity": 45,
  "notes": "Inventory correction"
}
```

**Response:** (Updated stock object)

## 🔒 Authorization Headers

All authenticated endpoints require the JWT token in the header:

```
Authorization: Bearer <jwt-token>
```

The frontend automatically injects this token in all requests via the `baseQuery` configuration in RTK Query services.

## 🚀 Error Handling

Expected error responses:

### 401 - Unauthorized
```json
{
  "message": "Unauthorized - Invalid or expired token"
}
```

### 400 - Bad Request
```json
{
  "message": "Validation error description"
}
```

### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "message": "Internal server error"
}
```

## 🔄 Modifying API Services

### Add a New Endpoint

In the appropriate service file (e.g., `productService.js`):

```javascript
export const productApi = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints
    
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: `/products/search`,
        params: { q: searchTerm },
      }),
      providesTags: ['Products'],
    }),
  }),
});

export const { useSearchProductsQuery } = productApi;
```

### Update API Base URL Dynamically

If needed, update the base URL in `/services/api.js`:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// Or fetch from config
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
```

## 📝 Testing with Mock Data

For testing without a backend, mock data is available in `lib/mockData.js`:

```javascript
import { mockProducts, mockStocks } from '@/lib/mockData';

// Use in components
const products = mockProducts; // Instead of API call
```

## 🔗 API Response Caching

RTK Query automatically caches responses. To control cache behavior:

```javascript
// Force refetch
const { refetch } = useGetProductsQuery();
refetch(); // Refetch from server

// Invalidate cache
[{ type: 'Products', id }] // Invalidates on mutation

// Poll for updates
useGetProductsQuery(undefined, { pollingInterval: 5000 }); // Poll every 5s
```

## 🐛 Debugging API Calls

Enable request/response logging:

```javascript
// In services/api.js
client.interceptors.request.use((config) => {
  console.log('Request:', config.method.toUpperCase(), config.url);
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

## ✅ Checklist

- [ ] Backend API is running
- [ ] `.env.local` has correct API URL
- [ ] All endpoints implemented in backend
- [ ] JWT token handling is correct
- [ ] CORS is configured on backend
- [ ] API responses match expected format
- [ ] Error handling is implemented
- [ ] Token refresh logic (if needed) is in place

---

For more details, see the main [README_SETUP.md](./README_SETUP.md)
