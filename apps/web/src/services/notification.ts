import axios from 'axios';
import type { Notification, NotificationListResponse, UnreadCountResponse } from '@uhomes/shared';

import { token as authToken } from '@/utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface GetNotificationsParams {
  read?: boolean;
  limit?: number;
  page?: number;
}

export interface SSENotificationEvent {
  type: 'notification' | 'connected' | 'heartbeat';
  message?: string;
  timestamp?: number;
  data?: Notification;
}

class NotificationService {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 3000;

  /**
   * Get paginated notifications for the authenticated user
   */
  async getNotifications(params?: GetNotificationsParams): Promise<NotificationListResponse> {
    const response = await axios.get<{ status: string; data: NotificationListResponse }>(
      `${API_BASE_URL}/api/notification`,
      {
        params,
        headers: {
          Authorization: `Bearer ${authToken.getToken()}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await axios.get<{ status: string; data: UnreadCountResponse }>(
      `${API_BASE_URL}/api/notification/unread-count`,
      {
        headers: {
          Authorization: `Bearer ${authToken.getToken()}`,
        },
      }
    );
    return response.data.data.unreadCount;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await axios.patch<{ status: string; data: Notification }>(
      `${API_BASE_URL}/api/notification/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken.getToken()}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ count: number }> {
    const response = await axios.patch<{ status: string; data: { count: number } }>(
      `${API_BASE_URL}/api/notification/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken.getToken()}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/notification/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${authToken.getToken()}`,
      },
    });
  }

  /**
   * Connect to SSE stream for real-time notifications
   */
  connectSSE(
    onNotification: (notification: Notification) => void,
    onError?: (error: Event) => void
  ): void {
    // Close existing connection if any
    this.disconnectSSE();

    const userToken = authToken.getToken();
    if (!userToken) {
      console.warn('No auth token found, cannot connect to SSE');
      return;
    }

    try {
      // Create EventSource with auth token in URL (EventSource doesn't support custom headers)
      const url = `${API_BASE_URL}/api/notification/stream?token=${encodeURIComponent(userToken)}`;
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        try {
          const data: SSENotificationEvent = JSON.parse(event.data);

          switch (data.type) {
            case 'connected':
              console.log('SSE connection established');
              this.reconnectAttempts = 0;
              break;

            case 'notification':
              if (data.data) {
                onNotification(data.data);
              }
              break;

            case 'heartbeat':
              // Keep-alive heartbeat, no action needed
              break;

            default:
              console.warn('Unknown SSE event type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);

        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.log('SSE connection closed, attempting to reconnect...');
          this.handleReconnect(onNotification, onError);
        }

        if (onError) {
          onError(error);
        }
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection opened');
      };
    } catch (error) {
      console.error('Error creating SSE connection:', error);
      this.handleReconnect(onNotification, onError);
    }
  }

  /**
   * Handle automatic reconnection with exponential backoff
   */
  private handleReconnect(
    onNotification: (notification: Notification) => void,
    onError?: (error: Event) => void
  ): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Exponential backoff
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connectSSE(onNotification, onError);
    }, delay);
  }

  /**
   * Disconnect from SSE stream
   */
  disconnectSSE(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE connection closed');
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Check if SSE is connected
   */
  isSSEConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}

export const notificationService = new NotificationService();
