/**
 * Main Application Router
 * MBK: Core routing configuration with protected routes and admin panel
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/app/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import AdminProtectedRoute from '@/app/components/AdminProtectedRoute';
import OnboardingRoute from '@/app/components/OnboardingRoute';

// Marketing
import LandingPage from '@/app/pages/LandingPage';
import PrivacyPolicyPage from '@/app/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/app/pages/TermsOfServicePage';
import CareersPage from '@/app/pages/CareersPage';
import ApplicationPage from '@/app/pages/ApplicationPage';
import BlogPage from '@/app/pages/BlogPage';
import BlogPostPage from '@/app/pages/BlogPostPage';

// Auth
import LoginPage from '@/app/pages/auth/LoginPage';
import SignupPage from '@/app/pages/auth/SignupPage';
import ForgotPasswordPage from '@/app/pages/auth/ForgotPasswordPage';
import VerifyCodePage from '@/app/pages/auth/VerifyCodePage';
import OnboardingPage from '@/app/pages/auth/OnboardingPage';
import AuthCallbackPage from '@/app/pages/auth/AuthCallbackPage';
import SessionDebugPage from '@/app/pages/auth/SessionDebugPage';
import AccountManagementPage from '@/app/pages/auth/AccountManagementPage';

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
import AdminLoginPage from '@/app/pages/admin/AdminLoginPage';
import AdminDashboard from '@/app/pages/admin/AdminDashboard';
import AdminClientsPage from '@/app/pages/admin/AdminClientsPage';
import AdminInvoicesPage from '@/app/pages/admin/AdminInvoicesPage';
import AdminRefundsPage from '@/app/pages/admin/AdminRefundsPage';
import AdminPromoCodesPage from '@/app/pages/admin/AdminPromoCodesPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
          {/* Marketing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/apply" element={<ApplicationPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

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
          <Route path="/account-management" element={<AccountManagementPage />} />

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

          {/* Admin Login - Public */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin - Protected */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="invoices" element={<AdminInvoicesPage />} />
            <Route path="refunds" element={<AdminRefundsPage />} />
            <Route path="promo-codes" element={<AdminPromoCodesPage />} />
          </Route>
        </Routes>
        <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}
