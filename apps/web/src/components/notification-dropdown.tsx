import { useState, useMemo } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@uhomes/ui-kit';
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
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0 || diffDays === 1) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'Last 7 days': [],
    Older: [],
  };

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.createdAt);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      groups.Today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(notification);
    } else if (notifDay >= sevenDaysAgo) {
      groups['Last 7 days'].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  return groups;
};

export const NotificationDropdown = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (activeFilter === 'unread') {
      filtered = notifications.filter((n) => !n.read);
    } else if (activeFilter === 'booking') {
      filtered = notifications.filter((n) => n.type.startsWith('booking_'));
    } else if (activeFilter === 'payment') {
      filtered = notifications.filter((n) => n.type.startsWith('payment_'));
    }

    return filtered;
  }, [notifications, activeFilter]);

  // Count notifications by type
  const bookingCount = useMemo(
    () => notifications.filter((n) => n.type.startsWith('booking_')).length,
    [notifications]
  );
  const paymentCount = useMemo(
    () =>
      notifications.filter(
        (n) => n.type.startsWith('payment_') || n.type.startsWith('transaction_')
      ).length,
    [notifications]
  );

  // Group filtered notifications by date
  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications]
  );

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative hidden w-10 h-10 justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:flex cursor-pointer">
          <SVGs.Notification />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-[#3E78FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="py-6 rounded-xl w-[675px] max-h-[600px] overflow-y-auto"
      >
        <div className="px-4 flex justify-between items-center">
          <h2 className="text-[#09090B] font-semibold text-2xl leading-[120%]">Notifications</h2>
          <DropdownMenuItem
            className="flex gap-1.5 items-center cursor-pointer"
            onClick={() => {
              notifications.forEach((n) => {
                deleteNotification(n._id);
              });
            }}
          >
            <span className="text-[#26203B] text-[13px]">clear all</span>
            <SVGs.XIcon className="w-[13px] h-[13px]" />
          </DropdownMenuItem>
        </div>

        <div className="border-y border-[#0000001A] flex justify-between items-center p-4 my-3">
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`border rounded-4xl py-1.5 px-2 flex gap-2 items-center ${
                activeFilter === 'all'
                  ? 'border-[#3E78FF] bg-[#3E78FF17]'
                  : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <span
                className={`font-medium text-sm leading-6 ${
                  activeFilter === 'all' ? 'text-[#3E78FF]' : 'text-[#71717A]'
                }`}
              >
                All
              </span>
              {activeFilter === 'all' && (
                <p className="rounded-[12px] bg-[#3E78FF] py-1 px-2 text-sm leading-4 text-white">
                  {notifications.length}
                </p>
              )}
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`text-sm leading-6 ${
                activeFilter === 'unread' ? 'text-[#3E78FF] font-medium' : 'text-[#71717A]'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('booking')}
              className={`text-sm leading-6 ${
                activeFilter === 'booking' ? 'text-[#3E78FF] font-medium' : 'text-[#71717A]'
              }`}
            >
              Bookings ({bookingCount})
            </button>
            <button
              onClick={() => setActiveFilter('payment')}
              className={`text-sm leading-6 ${
                activeFilter === 'payment' ? 'text-[#3E78FF] font-medium' : 'text-[#71717A]'
              }`}
            >
              Transactions ({paymentCount})
            </button>
          </div>

          <Button
            onClick={() => markAllAsRead()}
            className="rounded-xl border border-[#0000001A] hover:bg-white cursor-pointer py-1 px-2 flex items-center gap-2 bg-white"
          >
            <span className="text-[#09090B] text-xs leading-5">Mark all read</span>
            <SVGs.Marked className="w-3 h-3" />
          </Button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-[#71717A]">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-[#71717A]">No notifications</div>
        ) : (
          <>
            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => {
              if (groupNotifications.length === 0) return null;

              return (
                <div key={group} className="py-3 px-4 space-y-4">
                  <div className="space-y-3">
                    <p className="text-[#71717A] text-sm">{group}</p>
                    {groupNotifications.map((notification) => {
                      const iconConfig = getNotificationIcon(notification.type);
                      const IconComponent = iconConfig.icon;

                      return (
                        <div
                          key={notification._id}
                          className={`border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start cursor-pointer hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/30' : ''
                          }`}
                          onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                        >
                          <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                            <span className="text-white text-base leading-[18px]">
                              {notification.title.charAt(0).toUpperCase()}
                            </span>
                            <div
                              className={`absolute -right-2.5 -bottom-1.5 ${iconConfig.bgColor} w-[22px] h-[22px] rounded-full flex justify-center items-center`}
                            >
                              <IconComponent className={`w-3 h-3 ${iconConfig.iconColor || ''}`} />
                            </div>
                          </div>

                          <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2.5 whitespace-nowrap">
                                <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                                  {notification.title}
                                </h2>
                                {!notification.read && (
                                  <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-[#71717A] text-sm leading-[18px] capitalize">
                                  {formatDate(notification.createdAt)}
                                </p>
                                <button
                                  onClick={(e) => handleDelete(notification._id, e)}
                                  className="text-[#71717A] hover:text-red-500 transition-colors"
                                >
                                  <SVGs.XIcon className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-[#09090B] text-sm leading-6">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
