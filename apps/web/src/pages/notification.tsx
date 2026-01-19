import { useState, useMemo } from 'react';
import { Button } from '@uhomes/ui-kit';
import type { Notification, NotificationType } from '@uhomes/shared';
import { SVGs } from '@/assets/svgs/Index';
import { useNotifications } from '@/contexts/NotificationContext';

type FilterType = 'all' | 'unread' | 'booking' | 'payment';

interface NotificationIconConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor?: string;
}

const getNotificationIcon = (type: NotificationType): NotificationIconConfig => {
  const iconMap: Record<string, NotificationIconConfig> = {
    booking_created: { icon: SVGs.miniHouse, bgColor: 'bg-[#EEE5F5]', iconColor: 'text-[#8C31DC]' },
    booking_updated: { icon: SVGs.miniHouse, bgColor: 'bg-[#EEE5F5]', iconColor: 'text-[#8C31DC]' },
    booking_deleted: { icon: SVGs.miniHouse, bgColor: 'bg-[#EEE5F5]', iconColor: 'text-[#8C31DC]' },
    payment_created: { icon: SVGs.CreditCard, bgColor: 'bg-[#F0F9F6]' },
    payment_completed: { icon: SVGs.CreditCard, bgColor: 'bg-[#F0F9F6]' },
    payment_failed: { icon: SVGs.CreditCard, bgColor: 'bg-[#FFE5E5]' },
    payment_refunded: { icon: SVGs.CreditCard, bgColor: 'bg-[#F0F9F6]' },
    property_reviewed: {
      icon: SVGs.StartOutline,
      bgColor: 'bg-[#FFFDF3]',
      iconColor: 'text-[#8C31DC]',
    },
    account_updated: { icon: SVGs.Published, bgColor: 'bg-[#F0F9F6]' },
    password_reset: { icon: SVGs.Published, bgColor: 'bg-[#F0F9F6]' },
  };
  return iconMap[type] || { icon: SVGs.Notification, bgColor: 'bg-[#F0F9F6]' };
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups: Record<string, Notification[]> = {
    Today: [],
    'Last 7 days': [],
    Older: [],
  };

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.createdAt);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      groups.Today.push(notification);
    } else if (notifDay >= sevenDaysAgo) {
      groups['Last 7 days'].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  return groups;
};

export const MobileNotifications = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    if (activeFilter === 'unread') filtered = notifications.filter((n) => !n.read);
    else if (activeFilter === 'booking')
      filtered = notifications.filter((n) => n.type.startsWith('booking_'));
    else if (activeFilter === 'payment')
      filtered = notifications.filter((n) => n.type.startsWith('payment_'));
    return filtered;
  }, [notifications, activeFilter]);

  const counts = useMemo(
    () => ({
      all: notifications.length,
      unread: unreadCount,
      booking: notifications.filter((n) => n.type.startsWith('booking_')).length,
      payment: notifications.filter((n) => n.type.startsWith('payment_')).length,
    }),
    [notifications, unreadCount]
  );

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications]
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" className="size-11 rounded-full border-[#E5E5E5]">
          <SVGs.ChevronLeft className="size-4" />
        </Button>
        <h1 className="font-semibold text-2xl leading-[120%] tracking-[0%] text-[#09090B]">
          Notifications
        </h1>
        <Button
          variant="ghost"
          onClick={() => notifications.forEach((n) => deleteNotification(n._id))}
          className="gap-1"
        >
          <span className="text-[13px] leading-[100%] tracking-[0%] text-center align-middle text-[#26203B">
            clear all
          </span>
          <SVGs.XIcon className="w-3 h-3" />
        </Button>
      </div>
      <div className="border-y border-y-[#0000001A] p-4 mt-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'unread', label: 'Unread', count: counts.unread },
            { id: 'booking', label: 'Bookings', count: counts.booking },
            { id: 'payment', label: 'Transactions', count: counts.payment },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`flex gap-2 items-center rounded-4xl whitespace-nowrap border-[0.8px] transition-all text-sm leading-6 tracking-normal text-center px-2 py-1.5 ${
                activeFilter === filter.id
                  ? 'bg-[#3E78FF17] border-[#3E78FF] text-[#3E78FF] font-medium'
                  : 'border-transparent text-[#71717A]'
              }`}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span
                  className={`rounded-[12px] border-[0.8px] border-[#00000000] px-2 py-1 ${
                    activeFilter === filter.id ? 'bg-[#3E78FF] text-white' : 'text-[#71717A]'
                  }`}
                >
                  {activeFilter !== filter.id && '('}
                  {filter.count}
                  {activeFilter !== filter.id && ')'}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Mark All Read Button */}
        <Button
          onClick={() => markAllAsRead()}
          variant="outline"
          className="w-fit gap-2 rounded-lg border-[0.8px] border-[#0000001A] bg-white px-2 py-1 mt-9"
        >
          <span className="text-xs leading-5 tracking-normal text-center text-[#09090B]">
            Mark all read
          </span>
          <SVGs.Marked className="w-3 h-3" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {isLoading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No notifications found</div>
        ) : (
          Object.entries(groupedNotifications).map(
            ([group, list]) =>
              list.length > 0 && (
                <div key={group} className="mb-6">
                  <p className="text-[#71717A] text-sm mb-3">{group}</p>
                  <div className="space-y-3">
                    {list.map((n) => {
                      const iconConfig = getNotificationIcon(n.type);
                      const Icon = iconConfig.icon;
                      return (
                        <div
                          key={n._id}
                          className={`p-4 border border-gray-100 rounded-2xl flex gap-4 transition-colors ${!n.read ? 'bg-blue-50/20' : 'bg-white'}`}
                          onClick={() => !n.read && markAsRead(n._id)}
                        >
                          {/* Avatar & Sub-Icon */}
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full bg-[#3E78FF] flex items-center justify-center text-white text-lg font-semibold">
                              {n.title.charAt(0).toUpperCase()}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${iconConfig.bgColor} flex items-center justify-center`}
                            >
                              <Icon className={`w-3 h-3 ${iconConfig.iconColor || ''}`} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2 truncate">
                                <h3 className="font-bold text-sm text-[#09090B] truncate">
                                  {n.title}
                                </h3>
                                {!n.read && <div className="w-2 h-2 bg-[#3E78FF] rounded-full" />}
                              </div>
                              <span className="text-xs text-[#71717A] whitespace-nowrap ml-2">
                                {formatDate(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-[#09090B] leading-relaxed line-clamp-3">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
};
