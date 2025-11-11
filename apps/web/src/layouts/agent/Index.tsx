import Navbar from '@/pages/Agent/components/Navbar';
import { Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <div className="p-4   lg:p-0">
      <Navbar />
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Index;
