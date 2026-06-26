import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/Loader';
import { storage } from '@/utils/storage';

function isAdminTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AdminSessionRoute() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminTokenValid(storage.getAdminToken())) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
