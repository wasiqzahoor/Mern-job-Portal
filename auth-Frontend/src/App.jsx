import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./AuthContext";
import React, { useContext } from "react";

// Public Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import JobDetailsPage from "./components/JobDetailsPage";
import AllJobsPage from "./pages/user/AllJobsPage";

// User (Applicant) Pages
import UserHomePage from "./pages/user/UserHomePage";
import ViewProfile from "./pages/user/ViewProfile";
import MyApplicationsPage from "./pages/user/MyApplicationsPage";
import SavedJobsPage from "./pages/user/SavedJobsPage";
import UserDashboard from "./pages/user/UserDashboard";

// Company (Recruiter) Pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Postjob from "./components/Postjob";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyApplicationsPage from "./pages/company/CompanyApplicationsPage";
import ApplicationDetailsPage from "./pages/company/ApplicationDetailsPage";
import CompanyInterviewsPage from "./pages/company/CompanyInterviewsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CompaniesPage from "./pages/admin/CompaniesPage";
import CompanyDetailsPage from "./pages/admin/CompanyDetailsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminJobDetails from "./pages/admin/AdminJobDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import CompanyJobDetailsPage from "./pages/company/CompanyJobDetailsPage";
import CompanyDashboardWidget from "./pages/company/CompanyDashboardWidget";
import CompanyAboutUsPage from "./pages/company/CompanyAboutUsPage";
import AdminApplicationDetailsPage from "./pages/admin/AdminApplicationDetailsPage";
import AdminAboutUsPage from "./pages/admin/AdminAboutUsPage";
import AboutPage from "./pages/user/AboutPage";
import AdminApprovalPage from "./pages/admin/AdminApprovalPage";
import PendingApprovalPage from "./pages/company/PendingApprovalPage";

// ✅ FIXED ProtectedRoute component - now uses actual loading state from AuthContext
const ProtectedRoute = ({ children, roleRequired }) => {
  const { token, role, user, loading } = useContext(AuthContext); // ✅ Get loading from AuthContext

  console.log("ProtectedRoute Debug:", {
    loading,
    hasToken: !!token,
    userRole: user?.role,
    roleRequired,
    currentPath: window.location.pathname,
  });

  // ✅ Use the actual loading state from AuthContext - CRITICAL FIX
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // User not logged in or token is null
  if (!token) {
    console.log("ProtectedRoute: No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If roleRequired is specified, check the user's role
  if (roleRequired && (!user || user.role !== roleRequired)) {
    console.warn(
      `ProtectedRoute: User with role '${user?.role}' tried to access a '${roleRequired}' route.`
    );

    // Redirect to their respective dashboard based on actual role
    if (user?.role === "user") {
      console.log("ProtectedRoute: Redirecting user to /user dashboard");
      return <Navigate to="/user" replace />;
    }
    if (user?.role === "company") {
      console.log("ProtectedRoute: Redirecting company to /company dashboard");
      return <Navigate to="/company" replace />;
    }
    if (user?.role === "admin") {
      console.log("ProtectedRoute: Redirecting admin to /admin dashboard");
      return <Navigate to="/admin" replace />;
    }

    // Fallback if role is not recognized
    console.log("ProtectedRoute: Unrecognized role, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log(
    `ProtectedRoute: Access granted to ${window.location.pathname} for user with role: ${user?.role}`
  );
  return children;
};

// ✅ FIXED RootRedirect component - now uses actual loading state from AuthContext
const RootRedirect = () => {
  const { user, token, loading } = useContext(AuthContext); // ✅ Get loading from AuthContext

  console.log("RootRedirect Debug:", {
    loading,
    hasToken: !!token,
    userRole: user?.role,
  });

  // ✅ Use the actual loading state from AuthContext - CRITICAL FIX
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking login status...</p>
        </div>
      </div>
    );
  }

  // If token and user object exist, redirect based on role
  if (token && user) {
    console.log(
      `RootRedirect: Authenticated user with role '${user.role}', redirecting to appropriate dashboard`
    );

    switch (user.role) {
      case "user":
        return <Navigate to="/user" replace />;
      case "company":
        return <Navigate to="/company" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        console.warn("RootRedirect: Unknown user role:", user.role);
        return <Navigate to="/login" replace />;
    }
  }

  // If not logged in, redirect to login
  console.log("RootRedirect: No valid authentication, redirecting to login");
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/all-jobs" element={<AllJobsPage />} />
          <Route path="/admin/companies" element={<CompaniesPage />} />
          <Route path="/admin/companies/:id" element={<CompanyDetailsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          
          <Route path="/admin/users/:id" element={<UserDetailPage />} />
          
          <Route path="/admin/jobs" element={<AdminJobsPage />} />
          
          <Route path="/admin/jobs/:id" element={<AdminJobDetails />} />
          
          
          <Route
            path="/admin/applications"
            element={<AdminApplicationsPage />}
          />
          <Route path="/company/job/:id" element={<CompanyJobDetailsPage />} />
          <Route
            path="/company/CompanyDashboardWidget"
            element={<CompanyDashboardWidget />}
          />
          <Route path="/about" element={<CompanyAboutUsPage />} />
          <Route path="/userabout" element={<AboutPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute roleRequired="admin">
                {" "}
                <AdminProfile />{" "}
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute roleRequired="user">
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:id"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminApplicationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminAboutUsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute roleRequired="user">
                <SavedJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-profile"
            element={
              <ProtectedRoute roleRequired="user">
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute roleRequired="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/company"
            element={
              <ProtectedRoute roleRequired="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-jobs"
            element={
              <ProtectedRoute roleRequired="company">
                <CompanyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute roleRequired="company">
                <Postjob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute roleRequired="company">
                <Postjob isEditMode={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-profile"
            element={
              <ProtectedRoute roleRequired="company">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute roleRequired="company">
                <CompanyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute roleRequired="company">
                <ApplicationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/interviews"
            element={
              <ProtectedRoute roleRequired="company">
                <CompanyInterviewsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
         
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
