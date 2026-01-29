import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { useAuth } from '@/contexts/auth-context';

export const ProfileDropdown = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout(() => {
      navigate('/auth');
    });
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // Get user's first name or fallback
  const displayName = user?.fullName
    ? user.fullName.split(' ')[0] +
      (user.fullName.split(' ').length > 1 ? ' ' + user.fullName.split(' ')[1][0] + '.' : '')
    : 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hidden md:flex md:gap-x-3 md:items-center hover:cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <SVGs.ProfilePicSmall />
            )}
          </div>
          <span className="font-medium text-sm leading-[150%] tracking-[0%] text-center text-[#000000]">
            {displayName}
          </span>
          <SVGs.CaretDown />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoggingOut}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
