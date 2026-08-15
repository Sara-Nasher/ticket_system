import api from './api';
import type { AuthUser } from '../app/types';

export const authService = {
  register: async (userData: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const response = await api.get<AuthUser[]>('/users');
      const existingUsers = response.data;
      
      const userExists = existingUsers.find(
        (u) => u.email?.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (userExists) {
        throw new Error('این ایمیل قبلاً ثبت‌نام شده است');
      }

      const maxId = existingUsers.reduce((max, u) => {
        const id = typeof u.id === 'number' ? u.id : parseInt(String(u.id)) || 0;
        return id > max ? id : max;
      }, 0);

      const newUser = {
        ...userData,
        id: maxId + 1,
        status: 'active' as const,
        tickets: 0,
        created: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
      };

      const result = await api.post<AuthUser>('/users', newUser);
      return result.data;
    } catch (error: any) {
      console.error('❌ [register] Error:', error);
      throw new Error(error.message || 'خطا در ثبت‌نام');
    }
  },

  login: async (email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    try {
      console.log('🔐 [auth.login] Attempting login with:', email);
      console.log('🔐 [auth.login] Password length:', password?.length);

      const response = await api.get<AuthUser[]>('/users');
      const users = response.data;
      
      console.log('📥 [auth.login] Total users:', users.length);

      if (users.length > 0) {
        console.log('📥 [auth.login] First user:', {
          id: users[0].id,
          email: users[0].email,
          hasPassword: !!users[0].password,
          passwordLength: users[0].password?.length,
        });
      }

      let foundUser = null;
      for (const u of users) {
        const emailMatch = u.email?.toLowerCase() === email?.toLowerCase();
        const passwordMatch = u.password === password;
        
        if (emailMatch && passwordMatch) {
          foundUser = u;
          console.log('✅ User found!', u.email);
          break;
        }
      }
      
      if (!foundUser) {
        console.error('❌ [auth.login] User not found for email:', email);
        throw new Error('ایمیل یا رمز عبور اشتباه است');
      }

      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString().split('T')[0],
      };
      
      await api.put(`/users/${foundUser.id}`, updatedUser);

      const { password: _, ...userWithoutPassword } = updatedUser;
      const token = `mock-token-${foundUser.id}-${Date.now()}`;
      
      console.log('✅ [auth.login] Login successful for:', foundUser.email);
      
      return { user: userWithoutPassword as AuthUser, token };
    } catch (error: any) {
      console.error('❌ [auth.login] Error:', error);
      throw new Error(error.message || 'خطا در ورود به سیستم');
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthUser | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (userData: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('کاربر یافت نشد');
      
      const response = await api.put<AuthUser>(`/users/${currentUser.id}`, {
        ...currentUser,
        ...userData,
      });
      
      const { password, ...userWithoutPassword } = response.data;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword as AuthUser;
    } catch (error: any) {
      console.error('❌ [updateProfile] Error:', error);
      throw new Error(error.message || 'خطا در به‌روزرسانی');
    }
  },

  getAllUsers: async (): Promise<AuthUser[]> => {
    try {
      const response = await api.get<AuthUser[]>('/users');
      return response.data.map(({ password, ...user }) => user as AuthUser);
    } catch (error: any) {
      console.error('❌ [getAllUsers] Error:', error);
      throw new Error(error.message || 'خطا در دریافت کاربران');
    }
  },

  deleteUser: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      console.error('❌ [deleteUser] Error:', error);
      throw new Error(error.message || 'خطا در حذف کاربر');
    }
  },
};