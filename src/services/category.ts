import api from './api';

export interface Category {
  id: number;
  name: string;
  nameFa: string;
  slug: string;
  description: string;
  descriptionFa: string;
  count: number;
  icon: string;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    } catch (error: any) {
      console.error('❌ [getAllCategories] Error:', error);
      throw new Error(error.message || 'خطا در دریافت دسته‌بندی‌ها');
    }
  },

  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ [getCategoryById] Error:', error);
      throw new Error(error.message || 'دسته‌بندی یافت نشد');
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | undefined> => {
    try {
      const all = await categoryService.getAllCategories();
      return all.find(c => c.slug === slug);
    } catch (error: any) {
      console.error('❌ [getCategoryBySlug] Error:', error);
      throw new Error(error.message || 'دسته‌بندی یافت نشد');
    }
  },

  getCategoryStats: async (): Promise<{ name: string; count: number }[]> => {
    try {
      const categories = await categoryService.getAllCategories();
      return categories.map(c => ({
        name: c.name,
        count: c.count || 0,
      }));
    } catch (error: any) {
      console.error('❌ [getCategoryStats] Error:', error);
      throw new Error(error.message || 'خطا در دریافت آمار دسته‌بندی‌ها');
    }
  }
};