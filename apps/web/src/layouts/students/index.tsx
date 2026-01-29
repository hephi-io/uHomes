import { Outlet } from 'react-router-dom';

import { Navbar } from '../../components/navbar';
import { Toaster } from '@/components/ui/sonner';

const StudentLayout = () => {
  const navItems = [
    { id: 1, label: 'Dashboard', path: '/students/dashboard' },
    { id: 2, label: 'Find Hostels', path: '/students/hostels' },
    { id: 3, label: 'Help', path: '/students/help' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-0">
      <Navbar navItems={navItems} />

      <div className="mt-7 md:mt-8 lg:mt-0">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};

export default StudentLayout;
