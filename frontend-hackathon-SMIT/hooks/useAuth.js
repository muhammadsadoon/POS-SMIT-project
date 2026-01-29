import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROLE_PERMISSIONS } from '@/lib/constants';

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return auth;
};

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

export const useRoleGuard = (allowedRoles) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, router, allowedRoles]);

  return user && allowedRoles.includes(user.role);
};

export const usePermission = (action) => {
  const { user } = useAuth();
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(action) || false;
};
