import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute({ children, roleRequired }) {
  const { token, role, user, loading, isAuthenticated, checkAuth, hasRole } = useContext(AuthContext);

  console.log('ProtectedRoute Render: Current Context State:', {
    loading,
    token: !!token,
    roleFromContext: role,
    userObject: user,
    userRoleFromObject: user?.role,
    roleRequiredForRoute: roleRequired,
    isAuthenticated,
    currentPath: window.location.pathname
  });

  
  if (loading) {
    console.log('ProtectedRoute: Still loading authentication status...');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  
  if (!checkAuth()) {
    console.log('ProtectedRoute: Authentication check failed. Redirecting to /login');
    console.log('ProtectedRoute: Auth details:', {
      isAuthenticated,
      hasToken: !!token,
      hasUser: !!user
    });
    return <Navigate to="/login" replace />;
  }

  
  if (roleRequired) {
    if (!hasRole(roleRequired)) {
      console.warn(`ProtectedRoute: Access Denied! User's actual role is '${user?.role}', but '${roleRequired}' is required for this route.`);
      console.log('ProtectedRoute: User object at denial:', user);

      
      const userRole = user?.role;
      
      switch (userRole) {
        case 'user':
          console.log('ProtectedRoute: User has "user" role, redirecting to /user dashboard.');
          return <Navigate to="/user" replace />;
        case 'company':
          console.log('ProtectedRoute: User has "company" role, redirecting to /company dashboard.');
          return <Navigate to="/company" replace />;
        case 'admin':
          console.log('ProtectedRoute: User has "admin" role, redirecting to /admin dashboard.');
          return <Navigate to="/admin" replace />;
        default:
          console.log('ProtectedRoute: Role is unrecognized or undefined. Redirecting to /login.');
          return <Navigate to="/login" replace />;
      }
    }
  }

  console.log(`ProtectedRoute: Access granted to route '${window.location.pathname}' for user with role: ${user?.role}`);
  return children;
}