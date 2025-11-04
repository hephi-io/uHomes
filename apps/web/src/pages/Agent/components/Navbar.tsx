import Menu from '@/assets/svgs/menu.svg?react';
import { Link } from 'react-router-dom';
import { SVGs } from '@/assets/svgs/Index';

const Navbar = () => {
  return (
    <div className="rounded-xl justify-between border py-3 px-4 md:p-4 md:rounded-[12px]  lg:border-b lg:border-r-0 lg:border-l-0  lg:rounded-none lg:border-t border-[#E4E4E4] lg:py-4 lg:px-8 flex lg:gap-32 items-center md:justify-start ">
      <div className="flex items-center gap-2.5">
        <div className="hidden md:block lg:hidden">
          <Menu className="size-10" />
        </div>
        <div className="flex items-center  gap-2.5">
          <SVGs.UHome className="w-[46.4px] h-[45px]" />
          <p className="font-bold text-[18px] leading-6 uppercase">Homes</p>
        </div>
      </div>

      <div className=" hidden lg:flex justify-between items-center ">
        <div className="mx-6">
          <Link to="" className="text-Zinc/950 font-semibold text-sm ml-6">
            Dashboard
          </Link>
          <Link to="" className="text-[#71717A] font-semibold text-sm ml-6">
            Favorites
          </Link>
          <Link to="" className="text-[#71717A] font-semibold text-sm ml-6">
            Help
          </Link>
        </div>
      </div>

      <div></div>
      <div className=" md:hidden">
        <Menu className="" />
      </div>
    </div>
  );
};

export default Navbar;
