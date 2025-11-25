import Blobs from '@/assets/pngs/Blobs-Wrapper.png';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <section
      className="md:flex md:min-h-screen md:justify-center md:items-center font-Bricolage
             sm:bg-none md:bg-cover md:bg-center md:bg-no-repeat"
      style={{
        backgroundImage: `url(${Blobs})`,
      }}
    >
      <section>
        <Outlet />
      </section>
    </section>
  );
};

export default AuthLayout;
