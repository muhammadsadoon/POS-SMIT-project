"use client";

import { useAuthStore } from '@/store/zustand/auth-store';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Check if user has required role
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    manager: 2,
    staff: 1,
  };

  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Check if user can access admin/manager features
export const canManageProducts = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, 'manager');
};

// Check if user can access admin features
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'admin';
};

// Hook to protect routes based on role
export const useRequireAuth = (redirectTo: string = '/auth/login') => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { user, isAuthenticated, isLoading };
};

// Hook to protect routes based on role
export const useRequireRole = (
  requiredRole: UserRole,
  redirectTo: string = '/dashboard'
) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (!hasRole(user?.role, requiredRole)) {
        router.push(redirectTo);
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRole, router, redirectTo]);

  return { user, isAuthenticated, isLoading, hasAccess: hasRole(user?.role, requiredRole) };
};

// Hook to check project access
export const useRequireProjectAccess = (
  projectId: string | null,
  requiredRole?: UserRole
) => {
  const { user } = useAuthStore();
  const router = useRouter();

  // This will be enhanced when we load project data
  // For now, basic check
  useEffect(() => {
    if (!projectId && user) {
      router.push('/dashboard/projects');
    }
  }, [projectId, user, router]);

  return { hasAccess: !!projectId };
};
