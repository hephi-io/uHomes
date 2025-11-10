import { Outlet } from 'react-router-dom';
import MenuIcon from '@/layouts/students/components/menu-icon';
import UHome from '@/assets/svgs/u-home.svg?react';
import CaretDown from '@/assets/svgs/caret-down.svg?react';
import ProfilePicSmall from '@/assets/svgs/profile-pic-small.svg?react';
import Notification from '@/assets/svgs/students/notification.svg?react';

const Index = () => {
  const navButtons = [
    { id: 1, label: 'Dashboard' },
    { id: 2, label: 'Find Hostels' },
    { id: 3, label: 'Help' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-0">
      <div className="flex justify-between items-center rounded-lg border border-[#E4E9EE] bg-white md:rounded-xl md:border-[#F2F2F2] lg:rounded-none lg:border-x-0 lg:border-[#E4E4E4] p-3 md:p-4 lg:px-8 lg:py-4">
        <div className="md:flex md:gap-x-6 md:items-center lg:gap-x-38">
          <div className="hidden w-10 h-10 justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:flex lg:hidden">
            <MenuIcon />
          </div>
          <div className="flex gap-x-2 items-center">
            <UHome />
            <h1 className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
              HOMES
            </h1>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
            {navButtons.map((navButton) => (
              <a
                key={navButton.id}
                className="font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] hover:cursor-pointer"
              >
                {navButton.label}
              </a>
            ))}
          </div>
        </div>
        <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:hidden">
          <MenuIcon />
        </div>
        <div className="hidden md:block lg:flex lg:gap-x-8 lg:items-center">
          <div className="hidden w-10 h-10 justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:flex">
            <Notification />
          </div>
          <div className="hidden md:flex md:gap-x-3 md:items-center hover:cursor-pointer">
            <ProfilePicSmall />
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-center text-[#000000]">
              Brian F.
            </span>
            <CaretDown />
          </div>
        </div>
      </div>
      <div className="mt-7 md:mt-8 lg:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
