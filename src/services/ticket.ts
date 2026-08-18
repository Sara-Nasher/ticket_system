// src/services/ticket.ts
import api from './api';
import type { TicketRec } from '../app/types';

export const ticketService = {
  getTicketsPaginated: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    userId?: number;
  }): Promise<{ data: TicketRec[]; total: number; page: number; pageSize: number; totalPages: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('_page', String(params.page));
      if (params.pageSize) queryParams.append('_limit', String(params.pageSize));
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.category) queryParams.append('category', params.category);
      if (params.userId) queryParams.append('userId', String(params.userId));
      
      const response = await api.get<TicketRec[]>(`/tickets?${queryParams.toString()}`);
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
      console.error('getTicketsPaginated Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌ها';
    }
  },

  getAllTickets: async (): Promise<TicketRec[]> => {
    try {
      const response = await api.get<TicketRec[]>('/tickets');
      return response.data.sort((a, b) => a.id - b.id);
    } catch (error: any) {
      console.error('getAllTickets Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌ها';
    }
  },

  searchTickets: async (params: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    userId?: number;
  }): Promise<TicketRec[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.category) queryParams.append('category', params.category);
      if (params.userId) queryParams.append('userId', String(params.userId));
      
      const response = await api.get<TicketRec[]>(`/tickets?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('searchTickets Error:', error);
      throw error.message || 'خطا در جستجوی تیکت‌ها';
    }
  },

  getTicketById: async (id: number): Promise<TicketRec> => {
    try {
      const response = await api.get<TicketRec>(`/tickets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('getTicketById Error:', error);
      throw error.message || 'تیکت یافت نشد';
    }
  },

  createTicket: async (ticketData: Partial<TicketRec>): Promise<TicketRec> => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('کاربر وارد نشده است');
      }
      
      const currentUser = JSON.parse(userStr);
      
      if (!ticketData.subject || ticketData.subject.trim().length < 5) {
        throw new Error('موضوع تیکت باید حداقل ۵ کاراکتر باشد');
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      const newTicket = {
        subject: ticketData.subject.trim(),
        subjectFa: ticketData.subjectFa || ticketData.subject.trim(),
        category: ticketData.category || 'general',
        status: 'open' as const,
        priority: (ticketData.priority || 'medium') as any,
        userId: Number(ticketData.userId) || Number(currentUser.id) || 1,
        userName: ticketData.userName || currentUser.name || 'کاربر',
        userNameFa: ticketData.userNameFa || currentUser.nameFa || currentUser.name || 'کاربر',
        created: today,
        updated: today,
        desc: ticketData.desc || '',
        descFa: ticketData.descFa || ticketData.desc || '',
        assignee: ticketData.assignee || '',
        replies: 0,
        responses: [],
      };

      const response = await api.post<TicketRec>('/tickets', newTicket);
      return response.data;
    } catch (error: any) {
      console.error('createTicket Error:', error);
      throw error.message || 'خطا در ایجاد تیکت';
    }
  },

  updateTicket: async (id: number, ticketData: Partial<TicketRec>): Promise<TicketRec> => {
    try {
      const response = await api.put<TicketRec>(`/tickets/${id}`, {
        ...ticketData,
        updated: new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error: any) {
      console.error('updateTicket Error:', error);
      throw error.message || 'خطا در به‌روزرسانی تیکت';
    }
  },

  deleteTicket: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error: any) {
      console.error('deleteTicket Error:', error);
      throw error.message || 'خطا در حذف تیکت';
    }
  },

  addResponse: async (ticketId: number, message: string): Promise<TicketRec> => {
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : { name: 'کاربر', id: 0 };
      
      const newResponse = {
        id: Date.now(),
        userId: Number(currentUser.id) || 0,
        userName: currentUser.name || 'کاربر',
        message,
        createdAt: new Date().toISOString(),
      };

      const currentResponses = ticket.responses || [];
      const updatedTicket = {
        ...ticket,
        responses: [...currentResponses, newResponse],
        replies: (ticket.replies || 0) + 1,
        updated: new Date().toISOString().split('T')[0],
      };

      const response = await api.put<TicketRec>(`/tickets/${ticketId}`, updatedTicket);
      return response.data;
    } catch (error: any) {
      console.error('addResponse Error:', error);
      throw error.message || 'خطا در ارسال پاسخ';
    }
  },

  getTicketsByUser: async (userId: number): Promise<TicketRec[]> => {
    try {
      const allTickets = await ticketService.getAllTickets();
      return allTickets.filter(t => {
        const tUserId = typeof t.userId === 'number' ? t.userId : Number(t.userId);
        return tUserId === userId;
      });
    } catch (error: any) {
      console.error('getTicketsByUser Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌های کاربر';
    }
  },

  getTicketsByStatus: async (status: string): Promise<TicketRec[]> => {
    try {
      const allTickets = await ticketService.getAllTickets();
      return allTickets.filter(t => t.status === status);
    } catch (error: any) {
      console.error('getTicketsByStatus Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌ها بر اساس وضعیت';
    }
  },

  closeTicket: async (id: number): Promise<TicketRec> => {
    try {
      const ticket = await ticketService.getTicketById(id);
      const updatedTicket = {
        ...ticket,
        status: 'closed' as const,
        updated: new Date().toISOString().split('T')[0],
      };
      const response = await api.put<TicketRec>(`/tickets/${id}`, updatedTicket);
      return response.data;
    } catch (error: any) {
      console.error('closeTicket Error:', error);
      throw error.message || 'خطا در بستن تیکت';
    }
  },

  reopenTicket: async (id: number): Promise<TicketRec> => {
    try {
      const ticket = await ticketService.getTicketById(id);
      const updatedTicket = {
        ...ticket,
        status: 'open' as const,
        updated: new Date().toISOString().split('T')[0],
      };
      const response = await api.put<TicketRec>(`/tickets/${id}`, updatedTicket);
      return response.data;
    } catch (error: any) {
      console.error('reopenTicket Error:', error);
      throw error.message || 'خطا در بازگشایی تیکت';
    }
  },

  assignTicket: async (id: number, assignee: string): Promise<TicketRec> => {
    try {
      const ticket = await ticketService.getTicketById(id);
      const updatedTicket = {
        ...ticket,
        assignee,
        updated: new Date().toISOString().split('T')[0],
      };
      const response = await api.put<TicketRec>(`/tickets/${id}`, updatedTicket);
      return response.data;
    } catch (error: any) {
      console.error('assignTicket Error:', error);
      throw error.message || 'خطا در اختصاص تیکت';
    }
  },

  changePriority: async (id: number, priority: string): Promise<TicketRec> => {
    try {
      const ticket = await ticketService.getTicketById(id);
      const updatedTicket = {
        ...ticket,
        priority: priority as any,
        updated: new Date().toISOString().split('T')[0],
      };
      const response = await api.put<TicketRec>(`/tickets/${id}`, updatedTicket);
      return response.data;
    } catch (error: any) {
      console.error('changePriority Error:', error);
      throw error.message || 'خطا در تغییر اولویت تیکت';
    }
  },
};