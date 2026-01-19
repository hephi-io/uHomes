import { SVGs } from '../../../../../../packages/ui-kit/src/assets/svgs/Index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@uhomes/ui-kit';

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
      <div className="flex gap-8 items-center">
        <div className="relative p-2 bg-white rounded-full border border-gray-200 cursor-pointer">
          <SVGs.Notification className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-blue-500"></span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-3 items-center rounded cursor-pointer hover:bg-gray-200">
            <div className="size-10 rounded-full bg-gray-400 overflow-hidden">
              <img src="/admin-avatar.jpg" className="hidden size-full object-cover" alt="Admin" />
            </div>
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-center text-black">
              Admin Mel.
            </span>
            <SVGs.chevronDown className="size-4 -rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
