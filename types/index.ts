// Core Types for Store Management System

export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  role?: UserRole;
  photoURL?: string | null;
  phoneNumber?: string | null;
}

export interface ProjectMember {
  uid: string;
  role: UserRole;
  email?: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: Date | any;
  updatedAt?: Date | any;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string;
  isLive: boolean;
  passwordHash: string;
  projectId: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface Sale {
  id: string;
  productId: string;
  productName?: string; // denormalized for easier queries
  qty: number;
  total: number;
  soldBy: string;
  soldByName?: string; // denormalized
  projectId: string;
  createdAt: Date | any;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
}
