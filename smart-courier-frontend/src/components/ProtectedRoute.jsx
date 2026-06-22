import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const targetPath = user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
    // Only navigate if we're not already at the target path to avoid infinite loops
    if (location.pathname !== targetPath) {
      return <Navigate to={targetPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
