import { Outlet } from 'react-router-dom';

import { Navbar } from '@uhomes/ui-kit';

const Index = () => {

  return (
    <div className="p-4 md:p-6 lg:p-0">
      <Navbar userName='Brian F' navButtons={[
        { id: 1, label: 'Dashboard', link: '/student-dashboard' },
        { id: 2, label: 'Find Hostels', link: '/find-hostels' },
        { id: 3, label: 'Help', link: '/help' },
      ]} />
      <div className="mt-7 md:mt-8 lg:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
