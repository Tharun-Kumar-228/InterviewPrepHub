import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Feature Pages Imports
import LandingPage from './features/shared/LandingPage';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Dashboard from './features/dashboard/Dashboard';
import ExperienceList from './features/experiences/ExperienceList';
import ExperienceDetail from './features/experiences/ExperienceDetail';
import CreateExperience from './features/experiences/CreateExperience';
import RoomList from './features/rooms/RoomList';
import RoomDetail from './features/rooms/RoomDetail';
import CompanyList from './features/companies/CompanyList';
import CompanyDetail from './features/companies/CompanyDetail';
import SearchPage from './features/search/SearchPage';
import Bookmarks from './features/profile/Bookmarks';
import UserProfile from './features/profile/UserProfile';
import AdminPanel from './features/admin/AdminPanel';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loader fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Layout>{children}</Layout>;
};

// Semi-protected Route Guard (Loads nav layout but allows public/guest access)
const SemiProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return <Loader fullPage />;
  return <Layout>{children}</Layout>;
};

// Guest/Public Only Route (Redirects to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullPage />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <Router>
          <Routes>
            {/* Guest / Public Routes */}
            <Route path="/" element={<SemiProtectedRoute><LandingPage /></SemiProtectedRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

            {/* Protected Routes (All authenticated users) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/experiences" element={<ProtectedRoute><ExperienceList /></ProtectedRoute>} />
            <Route path="/experiences/create" element={<ProtectedRoute><CreateExperience /></ProtectedRoute>} />
            <Route path="/experiences/:id" element={<ProtectedRoute><ExperienceDetail /></ProtectedRoute>} />
            <Route path="/experiences/:id/edit" element={<ProtectedRoute><CreateExperience /></ProtectedRoute>} />
            
            <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
            <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetail /></ProtectedRoute>} />
            
            <Route path="/companies" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
            <Route path="/companies/:name" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
            
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

            {/* Admin Moderation Routes */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

            {/* Fallback to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;
