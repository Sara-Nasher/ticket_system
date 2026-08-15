import api from './api';
import type { TicketRec } from '../app/types';

interface GetTicketsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const ticketService = {
  getTickets: async (params: GetTicketsParams): Promise<PaginatedResponse<TicketRec>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('_page', String(params.page));
      if (params.pageSize) queryParams.append('_limit', String(params.pageSize));
      if (params.search) queryParams.append('q', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.category) queryParams.append('category', params.category);
      if (params.sortField) {
        queryParams.append('_sort', params.sortField);
        queryParams.append('_order', params.sortOrder || 'asc');
      }

      const response = await api.get<TicketRec[]>(`/tickets?${queryParams.toString()}`);
      const data = response.data;
      
      const allResponse = await api.get<TicketRec[]>('/tickets');
      
      return {
        data: data,
        total: allResponse.data.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      };
    } catch (error: any) {
      console.error('❌ [getTickets] Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌ها';
    }
  },

  getAllTickets: async (): Promise<TicketRec[]> => {
    try {
      const response = await api.get<TicketRec[]>('/tickets');
      console.log('📥 [getAllTickets] Count:', response.data.length);
      
      return response.data.sort((a, b) => a.id - b.id);
    } catch (error: any) {
      console.error('❌ [getAllTickets] Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌ها';
    }
  },

  getTicketById: async (id: number): Promise<TicketRec> => {
    try {
      const response = await api.get<TicketRec>(`/tickets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ [getTicketById] Error:', error);
      throw error.message || 'تیکت یافت نشد';
    }
  },

  createTicket: async (ticketData: Partial<TicketRec>): Promise<TicketRec> => {
    try {
        console.log('📝 [ticketService.createTicket] Input data:', ticketData);
        console.log('📝 [ticketService.createTicket] Subject:', ticketData.subject);
        
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
        
        console.log('📅 Today date:', today);
        
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

        console.log('📤 [ticketService.createTicket] Sending to server:', JSON.stringify(newTicket, null, 2));
        
        const response = await api.post<TicketRec>('/tickets', newTicket);
        console.log('✅ [ticketService.createTicket] Created with ID:', response.data.id);
        console.log('✅ [ticketService.createTicket] Created date:', response.data.created);
        
        return response.data;
    } catch (error: any) {
        console.error('❌ [createTicket] Error:', error);
        throw error.message || 'خطا در ایجاد تیکت';
    }
    },

  updateTicket: async (id: number, ticketData: Partial<TicketRec>): Promise<TicketRec> => {
    try {
      const response = await api.put<TicketRec>(`/tickets/${id}`, {
        ...ticketData,
        updated: new Date().toISOString().split('T')[0],
      });
      console.log('✅ Ticket updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [updateTicket] Error:', error);
      throw error.message || 'خطا در به‌روزرسانی تیکت';
    }
  },

  deleteTicket: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tickets/${id}`);
      console.log('✅ Ticket deleted:', id);
    } catch (error: any) {
      console.error('❌ [deleteTicket] Error:', error);
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
      console.log('✅ Response added:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [addResponse] Error:', error);
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
      console.error('❌ [getTicketsByUser] Error:', error);
      throw error.message || 'خطا در دریافت تیکت‌های کاربر';
    }
  },

  getTicketsByStatus: async (status: string): Promise<TicketRec[]> => {
    try {
      const allTickets = await ticketService.getAllTickets();
      return allTickets.filter(t => t.status === status);
    } catch (error: any) {
      console.error('❌ [getTicketsByStatus] Error:', error);
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
      console.log('✅ Ticket closed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [closeTicket] Error:', error);
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
      console.log('✅ Ticket reopened:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [reopenTicket] Error:', error);
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
      console.log('✅ Ticket assigned:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [assignTicket] Error:', error);
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
      console.log('✅ Priority changed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [changePriority] Error:', error);
      throw error.message || 'خطا در تغییر اولویت تیکت';
    }
  },
};