// src/services/user.ts
import api from './api';
import type { AuthUser } from '../app/types';

export const userService = {
  getUsersPaginated: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ data: AuthUser[]; total: number; page: number; pageSize: number; totalPages: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('_page', String(params.page));
      if (params.pageSize) queryParams.append('_limit', String(params.pageSize));
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get<AuthUser[]>(`/users?${queryParams.toString()}`);
      const total = parseInt(response.headers['x-total-count'] || '0');
      const totalPages = parseInt(response.headers['x-total-pages'] || '0');
      
      return {
        data: response.data,
        total: total,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: totalPages,
      };
    } catch (error: any) {
      console.error('getUsersPaginated Error:', error);
      throw new Error(error.message || 'خطا در دریافت کاربران');
    }
  },

  getAllUsers: async (): Promise<AuthUser[]> => {
    try {
      const response = await api.get<AuthUser[]>('/users');
      return response.data.map(({ password, ...user }) => user as AuthUser);
    } catch (error: any) {
      throw new Error(error.message || 'خطا در دریافت کاربران');
    }
  },

  searchUsers: async (params: {
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AuthUser[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get<AuthUser[]>(`/users?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('searchUsers Error:', error);
      throw new Error(error.message || 'خطا در جستجوی کاربران');
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