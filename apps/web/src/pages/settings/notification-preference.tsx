import { Button, Switch } from '@uhomes/ui-kit';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  resetNotificationPreferences,
} from '@/services/auth';
import { useAuth } from '@/contexts/auth-context';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface NotificationPreferenceForm {
  email: {
    payment: boolean;
    booking: boolean;
    systemUpdates: boolean;
    reviewAlert: boolean;
  };
  inApp: {
    payment: boolean;
    booking: boolean;
    systemUpdates: boolean;
    reviewAlert: boolean;
  };
  sms: {
    payment: boolean;
    booking: boolean;
    systemUpdates: boolean;
    reviewAlert: boolean;
  };
}

const defaultPreferences: NotificationPreferenceForm = {
  email: {
    payment: true,
    booking: true,
    systemUpdates: false,
    reviewAlert: false,
  },
  inApp: {
    payment: true,
    booking: true,
    systemUpdates: true,
    reviewAlert: true,
  },
  sms: {
    payment: false,
    booking: false,
    systemUpdates: true,
    reviewAlert: false,
  },
};

const NotificationPreference = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferenceForm>(defaultPreferences);
  const { refreshUser } = useAuth();

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setFetchingData(true);
        const { data } = await getNotificationPreferences();
        const prefs = data.data.notificationPreferences;

        // Merge with defaults to ensure all fields are present
        setPreferences({
          email: {
            ...defaultPreferences.email,
            ...prefs.email,
          },
          inApp: {
            ...defaultPreferences.inApp,
            ...prefs.inApp,
          },
          sms: {
            ...defaultPreferences.sms,
            ...prefs.sms,
          },
        });
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Failed to load notification preferences';
          toast.error(errorMessage);
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setFetchingData(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleSwitchChange = (
    channel: 'email' | 'inApp' | 'sms',
    type: 'payment' | 'booking' | 'systemUpdates' | 'reviewAlert',
    checked: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: checked,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateNotificationPreferences(preferences);
      await refreshUser();
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to update notification preferences';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetNotificationPreferences();
      setPreferences(defaultPreferences);
      await refreshUser();
      toast.success('Notification preferences reset to default');
    } catch (error) {
      console.error('Error resetting notification preferences:', error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to reset notification preferences';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-[#3E78FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-9">
      {/* Email Notifications */}
      <div className="space-y-4 w-[880px]">
        <h2 className="text-[#101828] font-medium text-sm leading-[150%]">Email Notifications</h2>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
          <Switch
            checked={preferences.email.payment}
            onCheckedChange={(checked) => handleSwitchChange('email', 'payment', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
          <Switch
            checked={preferences.email.booking}
            onCheckedChange={(checked) => handleSwitchChange('email', 'booking', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
          <Switch
            checked={preferences.email.systemUpdates}
            onCheckedChange={(checked) => handleSwitchChange('email', 'systemUpdates', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
          <Switch
            checked={preferences.email.reviewAlert}
            onCheckedChange={(checked) => handleSwitchChange('email', 'reviewAlert', checked)}
          />
        </div>
      </div>

      <div className="border border-[#D8D8D8] w-[880px]"></div>

      {/* In-app Notifications */}
      <div className="space-y-4 w-[880px]">
        <h2 className="text-[#101828] font-medium text-sm leading-[150%]">In-app Notifications</h2>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
          <Switch
            checked={preferences.inApp.payment}
            onCheckedChange={(checked) => handleSwitchChange('inApp', 'payment', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
          <Switch
            checked={preferences.inApp.booking}
            onCheckedChange={(checked) => handleSwitchChange('inApp', 'booking', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
          <Switch
            checked={preferences.inApp.systemUpdates}
            onCheckedChange={(checked) => handleSwitchChange('inApp', 'systemUpdates', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
          <Switch
            checked={preferences.inApp.reviewAlert}
            onCheckedChange={(checked) => handleSwitchChange('inApp', 'reviewAlert', checked)}
          />
        </div>
      </div>

      <div className="border border-[#D8D8D8] w-[880px]"></div>

      {/* SMS Alert Notifications */}
      <div className="space-y-4 w-[880px]">
        <h2 className="text-[#101828] font-medium text-sm leading-[150%]">
          SMS Alert Notifications
        </h2>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Payment notification</h3>
          <Switch
            checked={preferences.sms.payment}
            onCheckedChange={(checked) => handleSwitchChange('sms', 'payment', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Booking notification</h3>
          <Switch
            checked={preferences.sms.booking}
            onCheckedChange={(checked) => handleSwitchChange('sms', 'booking', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">System updates</h3>
          <Switch
            checked={preferences.sms.systemUpdates}
            onCheckedChange={(checked) => handleSwitchChange('sms', 'systemUpdates', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[#475467] text-sm leading-[150%]">Review Alert</h3>
          <Switch
            checked={preferences.sms.reviewAlert}
            onCheckedChange={(checked) => handleSwitchChange('sms', 'reviewAlert', checked)}
          />
        </div>
      </div>

      <div className="flex items-center gap-9">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading}
          className="bg-white cursor-pointer w-[188px] h-12 text-[#404D61] border px-4 py-2 leading-[100%] font-medium text-sm rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <span>Restore default</span>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
          disabled={loading}
          className="bg-[#3E78FF] hover:bg-[#3E78FF] hover:text-white cursor-pointer w-[188px] h-12 text-white border px-4 py-2 leading-[100%] font-medium text-sm rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin text-white" />
              Saving...
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreference;
