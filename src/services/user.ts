import api from './api';
import type { AuthUser } from '../app/types';

export const userService = {
  getAllUsers: async (): Promise<AuthUser[]> => {
    try {
      const response = await api.get<AuthUser[]>('/users');
      return response.data.map(({ password, ...user }) => user as AuthUser);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در دریافت کاربران');
    }
  },

  getUserById: async (id: number): Promise<AuthUser> => {
    try {
      const response = await api.get<AuthUser>(`/users/${id}`);
      const { password, ...user } = response.data;
      return user as AuthUser;
    } catch (error: any) {
      throw new Error(error.message || 'کاربر یافت نشد');
    }
  },

  createUser: async (data: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const response = await api.post<AuthUser>('/users', data);
      const { password, ...user } = response.data;
      return user as AuthUser;
    } catch (error: any) {
      throw new Error(error.message || 'خطا در ایجاد کاربر');
    }
  },

  updateUser: async (id: number, data: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const response = await api.put<AuthUser>(`/users/${id}`, data);
      const { password, ...user } = response.data;
      return user as AuthUser;
    } catch (error: any) {
      throw new Error(error.message || 'خطا در به‌روزرسانی کاربر');
    }
  },

  changeUserRole: async (id: number, role: 'admin' | 'user'): Promise<AuthUser> => {
    try {
      const response = await api.patch<AuthUser>(`/users/${id}`, { role });
      const { password, ...user } = response.data;
      return user as AuthUser;
    } catch (error: any) {
      throw new Error(error.message || 'خطا در تغییر نقش کاربر');
    }
  },

  changeUserStatus: async (id: number, status: string): Promise<AuthUser> => {
    try {
      const response = await api.patch<AuthUser>(`/users/${id}`, { status });
      const { password, ...user } = response.data;
      return user as AuthUser;
    } catch (error: any) {
      throw new Error(error.message || 'خطا در تغییر وضعیت کاربر');
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در حذف کاربر');
    }
  },
};