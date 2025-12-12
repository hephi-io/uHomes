import { Outlet } from 'react-router-dom';

import { Navbar } from '../../components/navbar';

const AgentLayout = () => {
  const navItems = [{ id: 1, label: 'Dashboard', path: '/agent-dashboard' }];

  return (
    <div className="p-4 lg:p-0">
      <Navbar navItems={navItems} />
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default AgentLayout;
