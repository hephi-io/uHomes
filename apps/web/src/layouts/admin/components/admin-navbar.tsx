import { SVGs } from '../../../../../../packages/ui-kit/src/assets/svgs/Index';

import { NotificationDropdown } from '../../../components/notification-dropdown';
import { ProfileDropdown } from '../../../components/profile-dropdown';

export const AdminNavbar = () => {
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center border-b border-[#E4E4E4] bg-white px-8 py-4">
      <div className="relative w-full max-w-xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <SVGs.MagnifyingGlass className="size-4" />
        </span>
        <input
          type="text"
          placeholder="Search users, listings, transactions..."
          className="w-full rounded-[10px] border-[0.8px] border-[#D1D5DC] text-base leading-[100%] tracking-normal text-[#0A0A0A80] focus:text-black focus:ring-1 focus:ring-blue-500 pl-14.5 pr-4 py-4"
        />
      </div>
      <div className="hidden md:block lg:flex lg:gap-x-8 lg:items-center">
        <NotificationDropdown />

        <ProfileDropdown />
      </div>
    </header>
  );
};
