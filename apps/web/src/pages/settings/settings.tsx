import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';
import { useAuth } from '@/contexts/auth-context';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tabs = [
    {
      label: 'Profile & Security',
      path: '/settings/profile-security',
    },
    {
      label: 'Payout Setting',
      path: '/settings/payment-setup',
    },
    {
      label: 'Notification preference',
      path: '/settings/notification-preference',
    },
  ];

  const handleBack = () => {
    // Navigate to the appropriate dashboard based on user type
    const userType = user?.userType?.type;
    if (userType === 'agent') {
      navigate('/agent-dashboard');
    } else if (userType === 'student') {
      navigate('/students/dashboard');
    } else if (userType === 'admin') {
      navigate('/admin');
    } else {
      // Fallback to agent dashboard if user type is unknown
      navigate('/agent-dashboard');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-[#E4E4E4] py-5 px-4 md:px-8">
        <Button
          variant="outline"
          className="size-11 rounded-full border-[#E5E5E5]"
          onClick={handleBack}
        >
          <SVGs.ChevronLeft />
        </Button>
        <h2 className="text-[#000000] font-semibold text-xl md:text-2xl">Settings</h2>
      </div>

      <div className="p-8">
        <div className="space-y-9">
          {/* Navigation Tabs */}
          <div className="flex gap-9">
            {tabs.map((tab) => (
              <NavLink
                to={tab.path}
                key={tab.label}
                className={({ isActive }) =>
                  `font-Bricolage text-sm font-semibold ${
                    isActive ? 'border-b border-black pb-2 text-[#232323]' : ''
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings;
