import { Outlet } from 'react-router-dom';
import { Navbar } from '@uhomes/ui-kit';
const Index = () => {
  return (
    <div className="p-4   lg:p-0">
      <Navbar
        userName="Brian F"
        navButtons={[
          { id: 1, label: 'Dashboard', link: '/agent-dashboard' },
          { id: 2, label: 'Favorites', link: '/Favorites' },
          { id: 3, label: 'Help', link: '/help' },
        ]}
      />
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Index;
