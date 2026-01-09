import { NavLink } from 'react-router-dom';
import { cn } from '@uhomes/ui-kit';

import { SVGs } from '../../../../packages/ui-kit/src/assets/svgs/Index';
import { ProfileDropdown } from './profile-dropdown';
import { NotificationDropdown } from './notification-dropdown';
import { Button } from '@uhomes/ui-kit';
import { useState } from 'react';

interface NavItem {
  id: number;
  label: string;
  path: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center rounded-lg border border-[#E4E9EE] bg-white md:rounded-xl md:border-[#F2F2F2] lg:rounded-none lg:border-x-0 lg:border-[#E4E4E4] p-3 md:p-4 lg:px-8 lg:py-4">
        <div className="md:flex md:gap-x-6 md:items-center lg:gap-x-38">
          <div
            className="hidden w-10 h-10 justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:flex lg:hidden"
            onClick={() => setOpen(true)}
          >
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

        <div
          className="w-10 h-10 flex justify-center items-center rounded-lg bg-[#F8F8F8] hover:cursor-pointer md:hidden"
          onClick={() => setOpen(true)}
        >
          <SVGs.MenuIcon />
        </div>

        <div className="hidden md:block lg:flex lg:gap-x-8 lg:items-center">
          <NotificationDropdown />

          <ProfileDropdown />
        </div>
      </div>
      <MenuDropdown open={open} close={close} navItems={navItems} />
    </>
  );
};

function MenuDropdown({
  open,
  close,
  navItems,
}: {
  open: boolean;
  close: () => void;
  navItems: NavItem[];
}) {
  return (
    <>
      <div
        className={`z-20 fixed left-0 right-0 top-0 bottom-0 bg-[#000000BF] transition-all duration-300 ease-in-out ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => close()}
      ></div>
      <div
        className={`z-30 fixed left-0 top-0 w-[340px] bg-white transition-all duration-300 ease-in-out ${open ? 'visible' : '-translate-x-full invisible'}`}
      >
        <div className="flex justify-between items-center px-[33px] py-4">
          <div className="flex gap-x-2 items-center">
            <SVGs.UHome />
            <span className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
              U - HOMES
            </span>
          </div>
          <SVGs.Cancel className="text-[#26203B] hover:cursor-pointer" onClick={() => close()} />
        </div>
        <div className="border-t border-t-[#E4E7EC]" />
        <div className="px-[33px] py-6">
          {navItems.map((navItem) => (
            <NavLink
              key={navItem.id}
              to={navItem.path}
              className="size-fit"
              onClick={() => close()}
            >
              <Button
                variant="ghost"
                className={`flex gap-x-4 hover:cursor-pointer p-2 ${navItem.id === 1 ? '' : 'mt-6'}`}
              >
                <span className="font-semibold text-sm leading-[110%] tracking-normal align-middle text-[#26203B]">
                  {navItem.label}
                </span>
              </Button>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
