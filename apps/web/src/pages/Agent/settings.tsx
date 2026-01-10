import { NavLink, Outlet } from 'react-router-dom';
const Settings = () => {
  return (
    <div>
      <div className="hidden md:block border-b border-[#E4E4E4] py-5 px-8">
        <h2 className="text-[#000000] font-semibold text-2xl">Settings</h2>
      </div>

      <div className="p-8">
        <div className="space-y-9">
          {/* Navigation Tabs */}
          <div className="flex gap-9">
            <NavLink
              to="/agent-dashboard/settings/profile-security"
              className={({ isActive }) =>
                `font-Bricolage text-sm font-semibold ${
                  isActive ? 'border-b border-black pb-2 text-[#232323]' : ''
                }`
              }
            >
              Profile & Security
            </NavLink>

            <NavLink
              to="/agent-dashboard/settings/payment-setup"
              className={({ isActive }) =>
                `font-Bricolage text-sm font-semibold ${
                  isActive ? 'border-b border-black pb-2 text-[#232323]' : ''
                }`
              }
            >
              Payout Setting
            </NavLink>

            <NavLink
              to="/agent-dashboard/settings/notification-preference"
              className={({ isActive }) =>
                `font-Bricolage text-sm font-semibold ${
                  isActive ? 'border-b border-black pb-2 text-[#232323]' : ''
                }`
              }
            >
              Notification preference
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;
