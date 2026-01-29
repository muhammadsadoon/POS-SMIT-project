# POS Dashboard - Architecture & Design Document

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                    │
│  (React Components, Pages, Forms, Tables, Dialogs)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              STATE MANAGEMENT LAYER                     │
│  (Redux Store, Slices, Selectors)                       │
│  ├── Auth Slice (user, token, permissions)             │
│  ├── Project Slice (projects, current)                 │
│  ├── Product Slice (products, current)                 │
│  └── Stock Slice (stocks, transactions)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│         DATA FETCHING & CACHING LAYER                  │
│  (RTK Query Services)                                   │
│  ├── Auth Service (login, register, me)               │
│  ├── Project Service (CRUD + members)                 │
│  ├── Product Service (CRUD + barcode)                 │
│  └── Stock Service (add, remove, adjust)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│            HTTP CLIENT & REQUEST LAYER                  │
│  (Axios with Interceptors)                              │
│  ├── Token Injection                                    │
│  ├── Error Handling                                     │
│  └── Request/Response Logging                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   BACKEND API                           │
│  (REST Endpoints)                                       │
│  ├── /api/auth/*                                        │
│  ├── /api/projects/*                                    │
│  ├── /api/products/*                                    │
│  └── /api/stock/*                                       │
└─────────────────────────────────────────────────────────┘
```

## 📊 Redux Store Structure

```
store/
├── index.js                 # Store configuration
└── slices/
    ├── authSlice.js
    │   ├── State: user, token, isAuthenticated, isLoading, error
    │   ├── Actions: setUser, logout, setLoading, setError, hydrate
    │   └── Hooks: useAuth()
    │
    ├── projectSlice.js
    │   ├── State: projects[], currentProject, isLoading, error
    │   ├── Actions: setProjects, setCurrentProject, add, update, delete
    │   └── Hooks: useProjects()
    │
    ├── productSlice.js
    │   ├── State: products[], currentProduct, isLoading, error
    │   ├── Actions: setProducts, setCurrentProduct, add, update, delete
    │   └── Hooks: useProducts()
    │
    └── stockSlice.js
        ├── State: stocks[], isLoading, error
        ├── Actions: setStocks, addStock, updateStock
        └── Hooks: useStocks()
```

## 🔌 RTK Query Services

### Service Pattern

Each service follows this pattern:
```javascript
export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Token injection
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    // Query endpoints (GET)
    getResource: builder.query({
      query: () => '/resource',
      providesTags: ['Resource'],
    }),
    // Mutation endpoints (POST, PUT, DELETE)
    createResource: builder.mutation({
      query: (data) => ({
        url: '/resource',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Resource'],
    }),
  }),
});

export const { useGetResourceQuery, useCreateResourceMutation } = serviceApi;
```

### Cache Invalidation

When mutations occur, related queries are invalidated:

```javascript
// When product is created, 'Products' tag is invalidated
// All queries with providesTags: ['Products'] are refetched
useCreateProductMutation() // invalidatesTags: ['Products']
useGetProductsQuery()       // providesTags: ['Products']
```

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. Form validation (React Hook Form + Zod)
   ↓
3. Send to /auth/login or /auth/register
   ↓
4. Backend validates and returns JWT + user data
   ↓
5. Dispatch setUser to Redux (saves token & user)
   ↓
6. Token stored in localStorage
   ↓
7. Token auto-injected in all future requests
   ↓
8. Protected routes check isAuthenticated
   ↓
9. If token expires (401), logout & redirect to login
```

## 🛣️ Route Protection

```javascript
// Protected Route Hook
export const useProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

// Usage in Components
function ProtectedPage() {
  const isAuthenticated = useProtectedRoute();
  
  if (!isAuthenticated) return null; // Show nothing until authenticated
  
  return <YourContent />;
}
```

## 👥 Role-Based Access Control

```javascript
// Permission Matrix
const ROLE_PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users'],
  manager: ['create', 'read', 'update', 'manage_inventory'],
  staff: ['read'],
};

// Usage
const canDelete = usePermission('delete');

{canDelete && <DeleteButton />}
```

## 📝 Form Architecture

### Validation Pipeline

```
1. User Input
   ↓
2. React Hook Form captures
   ↓
3. Real-time validation (Zod schema)
   ↓
4. Display error messages
   ↓
5. User submits
   ↓
6. Final validation
   ↓
7. API call
   ↓
8. Success/Error notification
```

### Zod Schema Example

```javascript
const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category required'),
  barcode: z.string().optional(),
});

// Usage
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(productSchema),
});
```

## 🎨 Component Hierarchy

```
RootLayout
├── Providers (Redux + Mantine)
│   └── DashboardLayout
│       ├── AppShell
│       ├── Navbar
│       │   └── Sidebar
│       ├── Header
│       │   ├── Title
│       │   └── Breadcrumbs
│       └── Main
│           ├── Container
│           └── Page Content
│               ├── Cards
│               ├── Tables
│               ├── Forms
│               └── Modals
```

## 🔄 Data Flow Example: Creating a Product

```
1. User clicks "Add Product"
   ↓
2. Modal opens with form
   ↓
3. User fills form
   ↓
4. React Hook Form validates in real-time
   ↓
5. User submits
   ↓
6. handleSubmit validates entire form
   ↓
7. Zod schema validates structure & types
   ↓
8. useCreateProductMutation() called
   ↓
9. RTK Query sends POST /products
   ↓
10. Axios interceptor injects JWT token
   ↓
11. Backend receives request
   ↓
12. Returns 201 with product data
   ↓
13. invalidatesTags: ['Products'] invalidates cache
   ↓
14. useGetProductsQuery() automatically refetches
   ↓
15. Table updates with new product
   ↓
16. Modal closes
   ↓
17. Toast shows "Product added successfully"
```

## 🎯 State Management Best Practices

### ✅ Do's
- Keep Redux for global UI state (auth, currentProject)
- Use RTK Query for server state (products, stocks)
- Derive state when possible (don't duplicate data)
- Normalize data in Redux
- Use selectors to access state

### ❌ Don'ts
- Don't store API data in Redux if using RTK Query
- Don't mutate Redux state directly
- Don't make API calls in reducers
- Don't store sensitive data like passwords
- Don't pass too many props (use context/Redux)

## 🚀 Performance Optimizations

### 1. Code Splitting
Next.js automatically code-splits at the route level

### 2. RTK Query Caching
Responses are cached and reused when possible

### 3. Memoization
```javascript
const Component = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

### 4. Lazy Loading
Modal components load on demand

### 5. Debouncing
Form inputs debounce validation

## 🔒 Security Considerations

### 1. JWT Token Storage
- Stored in localStorage for persistence
- Auto-injected in all requests
- Cleared on logout

### 2. XSS Protection
- React escapes content by default
- No innerHTML used for user input
- Zod validates all inputs

### 3. CSRF Protection
- Backend should implement CSRF tokens
- Include in request headers if needed

### 4. CORS
- Backend must configure CORS
- Only allow frontend domain

### 5. Sensitive Data
- Passwords never stored in Redux
- Tokens cleared on logout
- LocalStorage cleared on logout

## 📊 State Example

```javascript
// Redux State
{
  auth: {
    user: {
      id: "1",
      name: "John",
      email: "john@example.com",
      role: "admin"
    },
    token: "jwt-token...",
    isAuthenticated: true,
    isLoading: false,
    error: null
  },
  
  project: {
    projects: [{ id: "1", name: "Store", ... }],
    currentProject: { id: "1", name: "Store", ... },
    isLoading: false,
    error: null
  },
  
  product: {
    products: [{ id: "1", name: "Laptop", ... }],
    currentProduct: null,
    isLoading: false,
    error: null
  },
  
  stock: {
    stocks: [{ id: "1", productId: "1", quantity: 50 }],
    isLoading: false,
    error: null
  },
  
  // RTK Query caches
  authApi: { queries: {...}, mutations: {...} },
  projectApi: { queries: {...}, mutations: {...} },
  productApi: { queries: {...}, mutations: {...} },
  stockApi: { queries: {...}, mutations: {...} }
}
```

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Test reducers, selectors, utilities
test('authSlice sets user', () => {
  const state = authReducer(initialState, setUser(userData));
  expect(state.user).toEqual(userData);
});
```

### Integration Tests
```javascript
// Test component with Redux
test('LoginPage submits form', async () => {
  render(<LoginPage />);
  // Fill form and submit
  // Verify dispatch actions
});
```

### E2E Tests
```javascript
// Full user flows
test('User can login and create project', async () => {
  // Navigate to login
  // Login
  // Navigate to projects
  // Create project
  // Verify success
});
```

## 📈 Scaling Considerations

### As App Grows:
1. **Split services** - Create domain-specific RTK Query files
2. **Extract components** - Move complex UI into separate files
3. **Add middleware** - Implement logging, analytics middleware
4. **Optimize bundles** - Dynamic imports for heavy features
5. **Add error boundary** - Handle component crashes gracefully
6. **Implement error logging** - Send errors to monitoring service
7. **Add authentication refresh** - Handle token refresh logic
8. **Database optimization** - Implement pagination, filters

## 📚 File Organization

```
/app                      # Page routes
  /auth
  /dashboard
  /projects
  /products
  /stock
  layout.jsx
  page.jsx

/store                    # Redux
  index.js
  /slices
    authSlice.js
    projectSlice.js
    productSlice.js
    stockSlice.js

/services                 # API (RTK Query)
  api.js
  authService.js
  projectService.js
  productService.js
  stockService.js

/components               # React components
  Providers.jsx
  /layouts
    Sidebar.jsx
    DashboardLayout.jsx
  /forms
    ProductForm.jsx
    ProjectForm.jsx
  /tables
    ProductTable.jsx
    StockTable.jsx
  /ui
    dashboard-layout.jsx

/lib                      # Utilities
  theme.js
  schemas.js
  constants.js
  mockData.js

/hooks                    # Custom hooks
  useAuth.js
  usePermission.js
```

---

This architecture ensures scalability, maintainability, and clean separation of concerns.
