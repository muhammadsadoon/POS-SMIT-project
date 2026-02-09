"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/auth-store';
import { UserRole } from '@/types';
import { hasRole } from '@/lib/auth/guards';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/auth/login');
      return;
    }

    if (requiredRole && !hasRole(user?.role, requiredRole)) {
      router.push(redirectTo || '/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, requiredRole, user, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasRole(user?.role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
