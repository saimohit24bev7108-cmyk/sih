import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';

export function RequireAuth({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { isLoggedIn, role: currentRole } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (currentRole !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
