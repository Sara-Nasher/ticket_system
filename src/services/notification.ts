import api from './api';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  type: 'reply' | 'status_change' | 'resolved' | 'new_ticket' | 'assign' | 'mention';
  isRead: boolean;
  link: string;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5001';

export const notificationService = {
  getAllNotifications: async (): Promise<Notification[]> => {
    try {
      console.log('🔔 [getAllNotifications] Fetching notifications...');
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️ [getAllNotifications] No notifications found');
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('🔔 [getAllNotifications] Received:', data.length, 'notifications');
      return data.sort((a: Notification, b: Notification) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error: any) {
      console.error('❌ [getAllNotifications] Error:', error);
      return [];
    }
  },

  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    try {
      console.log(`🔔 [getUserNotifications] Fetching for user ${userId}...`);
      const all = await notificationService.getAllNotifications();
      const filtered = all.filter(n => n.userId === userId);
      console.log(`🔔 [getUserNotifications] Found ${filtered.length} notifications for user ${userId}`);
      return filtered;
    } catch (error: any) {
      console.error('❌ [getUserNotifications] Error:', error);
      return [];
    }
  },

  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    try {
      const userNotifications = await notificationService.getUserNotifications(userId);
      return userNotifications.filter(n => !n.isRead);
    } catch (error: any) {
      console.error('❌ [getUnreadNotifications] Error:', error);
      return [];
    }
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    try {
      const unread = await notificationService.getUnreadNotifications(userId);
      return unread.length;
    } catch (error: any) {
      console.error('❌ [getUnreadCount] Error:', error);
      return 0;
    }
  },

  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    try {
      console.log('🔔 [createNotification] Creating notification:', data);
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isRead: false,
          createdAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ [createNotification] Created:', result);
      return result;
    } catch (error: any) {
      console.error('❌ [createNotification] Error:', error);
      throw new Error(error.message || 'خطا در ایجاد نوتیف');
    }
  },

  markAsRead: async (id: number): Promise<Notification> => {
    try {
      console.log(`🔔 [markAsRead] Marking notification ${id} as read...`);
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('✅ [markAsRead] Done');
      return result;
    } catch (error: any) {
      console.error('❌ [markAsRead] Error:', error);
      throw new Error(error.message || 'خطا در به‌روزرسانی نوتیف');
    }
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    try {
      console.log(`🔔 [markAllAsRead] Marking all notifications as read for user ${userId}...`);
      const notifications = await notificationService.getUserNotifications(userId);
      const unread = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unread.map(n => notificationService.markAsRead(n.id))
      );
      console.log(`✅ [markAllAsRead] Marked ${unread.length} notifications as read`);
    } catch (error: any) {
      console.error('❌ [markAllAsRead] Error:', error);
      throw new Error(error.message || 'خطا در به‌روزرسانی نوتیف‌ها');
    }
  },

  deleteNotification: async (id: number): Promise<void> => {
    try {
      console.log(`🔔 [deleteNotification] Deleting notification ${id}...`);
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ [deleteNotification] Done');
    } catch (error: any) {
      console.error('❌ [deleteNotification] Error:', error);
      throw new Error(error.message || 'خطا در حذف نوتیف');
    }
  },

  deleteAllUserNotifications: async (userId: number): Promise<void> => {
    try {
      console.log(`🔔 [deleteAllUserNotifications] Deleting all notifications for user ${userId}...`);
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ [deleteAllUserNotifications] Done');
    } catch (error: any) {
      console.error('❌ [deleteAllUserNotifications] Error:', error);
      throw new Error(error.message || 'خطا در حذف نوتیف‌ها');
    }
  },
};