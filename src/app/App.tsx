import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/app/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import OnboardingRoute from '@/app/components/OnboardingRoute';

// Marketing
import LandingPage from '@/app/pages/LandingPage';

// Auth
import LoginPage from '@/app/pages/auth/LoginPage';
import SignupPage from '@/app/pages/auth/SignupPage';
import ForgotPasswordPage from '@/app/pages/auth/ForgotPasswordPage';
import VerifyCodePage from '@/app/pages/auth/VerifyCodePage';
import OnboardingPage from '@/app/pages/auth/OnboardingPage';
import AuthCallbackPage from '@/app/pages/auth/AuthCallbackPage';
import SessionDebugPage from '@/app/pages/auth/SessionDebugPage';

// Dashboard
import DashboardLayout from '@/app/components/DashboardLayout';
import DashboardHome from '@/app/pages/dashboard/DashboardHome';
import CampaignsPage from '@/app/pages/dashboard/CampaignsPage';
import ProspectsPage from '@/app/pages/dashboard/ProspectsPage';
import MeetingsPage from '@/app/pages/dashboard/MeetingsPage';
import AnalyticsPage from '@/app/pages/dashboard/AnalyticsPage';
import AISDRSettingsPage from '@/app/pages/dashboard/AISDRSettingsPage';
import IntegrationsPage from '@/app/pages/dashboard/IntegrationsPage';
import SettingsPage from '@/app/pages/dashboard/SettingsPage';

// Admin
import AdminLayout from '@/app/components/AdminLayout';
import AdminDashboard from '@/app/pages/admin/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Marketing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/onboarding" element={
            <OnboardingRoute>
              <OnboardingPage />
            </OnboardingRoute>
          } />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/debug-session" element={<SessionDebugPage />} />
          
          {/* Dashboard - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="prospects" element={<ProspectsPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="ai-sdr-settings" element={<AISDRSettingsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Admin - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}
