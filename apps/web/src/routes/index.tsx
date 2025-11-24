import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/auth';
import AgentLayout from '@/layouts/agent';
import StudentDashboardLayout from '@/layouts/students';
import BookingLayout from '@/layouts/booking';

import Auth from '@/pages/auth/auth';
import ForgotPassword from '@/pages/auth/forgot-password';
import VerifyAccount from '@/pages/auth/verify-account';
import ResetPassword from '@/pages/auth/reset-password';
import ResetPasswordSuccess from '@/pages/auth/reset-password-success';
import Dashboard from '@/pages/Agent/dashboard';
import { StudentDashboard, Hostels, Hostel, Help } from '@/pages/students';
import Booking from '@/pages/booking/booking';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Auth /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-account', element: <VerifyAccount /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'reset-password-success', element: <ResetPasswordSuccess /> },
    ],
  },
  {
    path: '/agent-dashboard',
    element: <AgentLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/students',
    element: <StudentDashboardLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'hostels', element: <Hostels /> },
      { path: 'hostels/:id', element: <Hostel /> },
      { path: 'help', element: <Help /> },
      {
        element: <BookingLayout />,
        children: [{ path: 'booking', element: <Booking /> }],
      },
    ],
  },
]);

export default router;
