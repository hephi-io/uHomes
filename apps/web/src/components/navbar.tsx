import { NavLink } from 'react-router-dom';
import { cn } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { ProfileDropdown } from './profile-dropdown';
import Notification from '@/pages/Agent/notification';

interface NavItem {
  id: number;
  label: string;
  path: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center rounded-lg border border-[#E4E9EE] bg-white md:rounded-xl md:border-[#F2F2F2] lg:rounded-none lg:border-x-0 lg:border-[#E4E4E4] p-3 md:p-4 lg:px-8 lg:py-4">
      <div className="md:flex md:gap-x-6 md:items-center lg:gap-x-38">
        <div className="hidden w-10 h-10 justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:flex lg:hidden">
          <SVGs.MenuIcon />
        </div>

        <div className="flex gap-x-2 items-center">
          <SVGs.UHome />

          <h1 className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
            HOMES
          </h1>
        </div>

        <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
          {navItems.map((navItem) => (
            <NavLink
              key={navItem.id}
              to={navItem.path}
              className={({ isActive }) =>
                cn(
                  'font-semibold text-sm leading-[100%] tracking-[0%] text-[#71717A] hover:cursor-pointer',
                  isActive && 'text-[#000000]'
                )
              }
            >
              {navItem.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:hidden">
        <SVGs.MenuIcon />
      </div>

      <div className="hidden md:block lg:flex lg:gap-x-8 lg:items-center">
        <Notification />

        <ProfileDropdown />
      </div>
    </div>
  );
};
