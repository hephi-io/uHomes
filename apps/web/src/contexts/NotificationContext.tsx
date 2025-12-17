import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Notification } from '@uhomes/shared';

import { notificationService } from '@/services/notification';
import { token } from '@/utils';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  fetchNotifications: (params?: { read?: boolean; limit?: number; page?: number }) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Notification sound - using a simple base64 encoded beep sound
  // In production, you'd want to use a proper audio file
  const notificationSoundDataUrl =
    'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiDcIF2q88OScTgwOV7Tq66FTFgY7ntnxy3Aqhj6ex/PTiTYIG2q87+eSUQ0NVq3p7KFTFwc9odXuy3Uq';

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(notificationSoundDataUrl);
    audioRef.current.volume = 0.5;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play notification sound:', error);
      });
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (params?: { read?: boolean; limit?: number; page?: number }) => {
      setIsLoading(true);
      try {
        const result = await notificationService.getNotifications(params);
        setNotifications(result.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif))
        );

        // Refresh unread count
        await refreshUnreadCount();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
    [refreshUnreadCount]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.deleteNotification(notificationId);

        // Update local state
        setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));

        // Refresh unread count if the deleted notification was unread
        const deletedNotification = notifications.find((n) => n._id === notificationId);
        if (deletedNotification && !deletedNotification.read) {
          await refreshUnreadCount();
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [notifications, refreshUnreadCount]
  );

  // Handle new notification from SSE
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Increment unread count if notification is unread
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }

      // Play notification sound
      playNotificationSound();
    },
    [playNotificationSound]
  );

  // Connect to SSE when authenticated
  useEffect(() => {
    if (token.isAuthenticated()) {
      // Fetch initial data
      fetchNotifications();
      refreshUnreadCount();

      // Connect to SSE for real-time updates
      notificationService.connectSSE(handleNewNotification, (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
      });

      setIsConnected(true);

      // Cleanup on unmount
      return () => {
        notificationService.disconnectSSE();
      };
    }
  }, []); // Empty dependency array - only run once on mount

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
