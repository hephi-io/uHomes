import Navbar from '@/pages/Agent/components/Navbar';
import { Outlet } from 'react-router-dom';

function AgentLayout() {
  return (
    <div className="p-4 lg:p-0">
      <Navbar />
      <section>
        <Outlet />
      </section>
    </div>
  );
}

export default AgentLayout;
