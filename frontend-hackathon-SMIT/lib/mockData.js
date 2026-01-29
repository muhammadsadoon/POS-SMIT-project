// lib/mockData.js
// This file provides mock data for testing the frontend without a backend

export const mockAuth = {
  register: async (data) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: data.name,
            email: data.email,
            role: 'admin',
          },
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000)
    );
  },
  
  login: async (data) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: 'John Doe',
            email: data.email,
            role: 'admin',
          },
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000)
    );
  },
};

export const mockProjects = [
  {
    id: '1',
    name: 'Main Store',
    description: 'Primary retail location',
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Warehouse',
    description: 'Central warehouse',
    status: 'active',
    createdAt: new Date(),
  },
];

export const mockProducts = [
  {
    id: '1',
    name: 'Laptop',
    price: 999.99,
    category: 'electronics',
    barcode: '123456789012',
    sku: 'LAPTOP-001',
    description: 'High-performance laptop',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Mouse',
    price: 29.99,
    category: 'electronics',
    barcode: '123456789013',
    sku: 'MOUSE-001',
    description: 'Wireless mouse',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'T-Shirt',
    price: 19.99,
    category: 'clothing',
    barcode: '123456789014',
    sku: 'TSHIRT-001',
    description: 'Cotton t-shirt',
    createdAt: new Date(),
  },
];

export const mockStocks = [
  {
    id: '1',
    productId: '1',
    quantity: 50,
    minQuantity: 10,
    updatedAt: new Date(),
  },
  {
    id: '2',
    productId: '2',
    quantity: 150,
    minQuantity: 20,
    updatedAt: new Date(),
  },
  {
    id: '3',
    productId: '3',
    quantity: 5,
    minQuantity: 30,
    updatedAt: new Date(),
  },
];

export const mockMembers = [
  {
    id: '1',
    projectId: '1',
    userId: '1',
    role: 'admin',
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    createdAt: new Date(),
  },
  {
    id: '2',
    projectId: '1',
    userId: '2',
    role: 'manager',
    user: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    createdAt: new Date(),
  },
];
