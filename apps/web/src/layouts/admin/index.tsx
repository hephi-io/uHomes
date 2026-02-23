import { Outlet, NavLink } from 'react-router-dom';
import { SVGs } from '../../../../../packages/ui-kit/src/assets/svgs/Index'; // Adjust based on your path
import { AdminNavbar } from '@/layouts/admin/components/admin-navbar';

export const AdminLayout = () => {
  const menuItems = [
    { id: 1, label: 'OVERVIEW', path: '/admin/dashboard', icon: SVGs.Category },
    { id: 2, label: 'AGENT APPLICATIONS', path: '/admin/agents', icon: SVGs.User, badge: 30 },
    { id: 3, label: 'HOSTEL LISTINGS', path: '/admin/listings', icon: SVGs.CheckList, badge: 8 },
    {
      id: 4,
      label: 'ESCROW & PAYMENTS',
      path: '/admin/payments',
      icon: SVGs.MoneyBagFree,
      badge: 6,
    },
    { id: 5, label: 'ACCOUNTS', path: '/admin/accounts', icon: SVGs.UserAccount },
    // { id: 6, label: 'ADVERTISEMENTS', path: '/admin/ads', icon: SVGs.Megaphone },
  ];

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <aside className="h-full flex flex-col justify-between border-r border-[#E4E4E4] bg-white px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <SVGs.UHome className="text-[#3E78FF]" />
            <h1 className="font-bold text-[18px] leading-6 tracking-normal align-middle text-[#1F1E1E]">
              HOMES
            </h1>
          </div>
          <nav className="space-y-4 mt-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `
                  flex justify-between items-center rounded-xl text-[#757575] transition-colors p-3
                  ${isActive ? 'bg-[#F6F6F6]' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex gap-x-3 items-center">
                  <item.icon />
                  <span className="font-medium text-[10px] leading-3 tracking-[0.4px] align-middle">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-[#FFD9D9] text-[10px] leading-3 tracking-[0.4px] align-middle text-[#FF4D4D] p-1.5">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-t-[#E5E5E5] mt-6"></div>
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex gap-3 items-center rounded-xl text-[#757575] transition-colors p-3 mt-6
              ${isActive ? 'bg-[#F6F6F6]' : 'hover:bg-gray-50'}
            `}
          >
            <SVGs.Settings />
            <span className="font-medium text-[10px] leading-3 tracking-[0.4px] align-middle">
              SETTINGS
            </span>
          </NavLink>
        </div>
        {/* <div className="space-y-4">
          <NavLink
            to="/admin/help"
            className={({ isActive }) => `
              flex gap-3 items-center rounded-xl text-[#757575] transition-colors p-3 mt-6
              ${isActive ? 'bg-[#F6F6F6]' : 'hover:bg-gray-50'}
            `}
          >
            <SVGs.MessageQuestion />
            <span className="font-medium text-[10px] leading-3 tracking-[0.4px] align-middle">
              HELP
            </span>
          </NavLink>
          <NavLink
            to="/admin/logout"
            className={({ isActive }) => `
              flex gap-3 items-center rounded-xl text-[#757575] transition-colors p-3 mt-4
              ${isActive ? 'bg-[#F6F6F6]' : 'hover:bg-gray-50'}
            `}
          >
            <SVGs.Logout />
            <span className="font-medium text-[10px] leading-3 tracking-[0.4px] align-middle">
              LOGOUT
            </span>
          </NavLink>
        </div> */}
      </aside>
      {/* Main Content */}
      <main className="h-full flex-1 overflow-auto">
        <AdminNavbar />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
