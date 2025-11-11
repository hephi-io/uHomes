import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/auth/Index';
import Auth from '@/pages/auth/auth';
import ForgotPassword from '@/pages/auth/forgot-password';
import VerifyAccount from '@/pages/auth/verify-account';
import ResetPassword from '@/pages/auth/reset-password';
import ResetPasswordSuccess from '@/pages/auth/reset-password-success';
import AgentLayout from '@/layouts/agent/Index';
import Dashboard from '@/pages/Agent/dashboard';
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
      { path: 'Verify-Account', element: <VerifyAccount /> },
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
]);

export default router;
