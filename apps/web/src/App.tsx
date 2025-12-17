import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth-context';
import { NotificationProvider } from './contexts/NotificationContext';
import router from './routes';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="bottom-center" />
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
