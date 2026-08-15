import api from './api';

export interface Activity {
  id: number;
  userId: number;
  userName: string;
  action: string;
  actionFa: string;
  timestamp: string;
  details: string;
}

export const activityService = {
  getAllActivities: async (): Promise<Activity[]> => {
    try {
      const response = await api.get<Activity[]>('/activities');
      return response.data.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error: any) {
      console.error('❌ [getAllActivities] Error:', error);
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(error.message || 'خطا در دریافت فعالیت‌ها');
    }
  },

  getActivitiesByUser: async (userId: number): Promise<Activity[]> => {
    try {
      const all = await activityService.getAllActivities();
      return all.filter(a => a.userId === userId);
    } catch (error: any) {
      console.error('❌ [getActivitiesByUser] Error:', error);
      return [];
    }
  },

  createActivity: async (data: Partial<Activity>): Promise<Activity | null> => {
    try {
      const response = await api.post<Activity>('/activities', {
        ...data,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ [createActivity] Error:', error);
      return null;
    }
  },

  getRecentActivities: async (limit: number = 10): Promise<Activity[]> => {
    try {
      const all = await activityService.getAllActivities();
      return all.slice(0, limit);
    } catch (error: any) {
      console.error('❌ [getRecentActivities] Error:', error);
      return [];
    }
  }
};