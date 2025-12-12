import { createBrowserRouter, Navigate } from 'react-router-dom';

import AuthLayout from '@/layouts/auth/index';
import AgentLayout from '@/layouts/agent/index';
import StudentDashboardLayout from '@/layouts/students/index';
import BookingLayout from '@/layouts/booking/index';
import ProtectedRoute from '../components/protected-route';
import { PublicRoute } from '../components/public-route';

import Auth from '@/pages/auth/auth';
import ForgotPassword from '@/pages/auth/forgot-password';
import VerifyAccount from '@/pages/auth/verify-account';
import VerifySuccess from '@/pages/auth/verify-success';
import VerifyFailed from '@/pages/auth/verify-failed';
import ResetPassword from '@/pages/auth/reset-password';
import ResetPasswordSuccess from '@/pages/auth/reset-password-success';
import Dashboard from '@/pages/Agent/dashboard';
import { StudentDashboard, Hostels, Hostel, Help } from '@/pages/students';
import Booking from '@/pages/booking/booking';
import SMNewProperty from '@/pages/Agent/components/sm-add-new-property';
import Checkout from '@/pages/booking/checkout';
import CheckoutSuccess from '@/pages/booking/checkout-success';
import PaymentCallback from '@/pages/booking/payment-callback';
import Settings from '@/pages/Agent/settings';
import ProfileSecurity from '@/pages/Agent/components/settings/profile-security';
import PaymentSetup from '@/pages/Agent/components/settings/payment-setup';
import NotificationPreference from '@/pages/Agent/components/settings/notification-preference';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <Auth /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-account', element: <VerifyAccount /> },
      { path: 'verify-success', element: <VerifySuccess /> },
      { path: 'verify-failed', element: <VerifyFailed /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'reset-password-success', element: <ResetPasswordSuccess /> },
    ],
  },
  {
    path: '/verify',
    element: (
      <PublicRoute>
        <VerifyAccount />
      </PublicRoute>
    ),
  },
  {
    path: 'SMNewProperty',
    element: (
      <ProtectedRoute>
        <SMNewProperty />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent-dashboard',
    element: (
      <ProtectedRoute>
        <AgentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          { path:'profile-security', element: <ProfileSecurity /> },
          { path:'payment-setup', element: <PaymentSetup /> },
          { path:'notification-preference', element: <NotificationPreference /> },
        ]
      },
    ],
  },
  {
    path: '/students',
    element: (
      <ProtectedRoute>
        <StudentDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'hostels', element: <Hostels /> },
      { path: 'hostels/:id', element: <Hostel /> },
      { path: 'help', element: <Help /> },
      {
        path: 'booking',
        element: <BookingLayout />,
        children: [
          { index: true, element: <Booking /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'callback', element: <PaymentCallback /> },
          { path: 'checkout-success', element: <CheckoutSuccess /> },
        ],
      },
    ],
  },
]);

export default router;
