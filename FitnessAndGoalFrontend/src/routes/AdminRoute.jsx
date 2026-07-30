import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import { Loading } from '../components';

export function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Checking authentication..." />
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has ADMIN role
  const isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');
  if (!isAdmin) {
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AdminPublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Loading..." />
      </div>
    );
  }

  // If user is logged in and is admin, redirect to admin dashboard
  if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
    const from = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  // If user is logged in but not admin, redirect to regular dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}