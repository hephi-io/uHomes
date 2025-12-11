import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/auth-context';
import router from './routes';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
