import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: Record<string, any>;
}

interface UseApiReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  total: number;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  sort: { field: string; order: 'ascend' | 'descend' | null };
  setSort: (sort: { field: string; order: 'ascend' | 'descend' | null }) => void;
  refetch: () => void;
}

export const useApi = <T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const [pageSize, setPageSize] = useState<number>(options.initialPageSize || 10);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<Record<string, any>>(options.initialFilters || {});
  const [sort, setSort] = useState<{ field: string; order: 'ascend' | 'descend' | null }>({
    field: '',
    order: null,
  });
  const [fetchCounter, setFetchCounter] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseURL = 'http://localhost:5000';
      let fullUrl = `${baseURL}${url}`;
      
      const params = new URLSearchParams();

      if (page) params.append('_page', String(page));
      if (pageSize) params.append('_limit', String(pageSize));
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      if (sort.field && sort.order) {
        params.append('_sort', sort.field);
        params.append('_order', sort.order === 'ascend' ? 'asc' : 'desc');
      }
      
      if (params.toString()) {
        fullUrl += `?${params.toString()}`;
      }
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      let dataArray: T[] = [];
      let totalCount = 0;

      if (Array.isArray(jsonData)) {
        dataArray = jsonData;
        totalCount = jsonData.length;
      } else if (jsonData && typeof jsonData === 'object') {
        if (Array.isArray(jsonData.data)) {
          dataArray = jsonData.data;
          totalCount = jsonData.total || jsonData.data.length || 0;
        } else {
          dataArray = [jsonData as T];
          totalCount = 1;
        }
      } else {
        dataArray = [];
        totalCount = 0;
      }
      
      setData(dataArray);
      setTotal(totalCount);
    } catch (err: any) {
      console.error('🔴 [useApi] Error:', err);
      setError(err.message || 'خطا در دریافت داده‌ها');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [url, page, pageSize, filters, sort, fetchCounter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setFetchCounter(prev => prev + 1);
  }, []);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    filters,
    setFilters,
    sort,
    setSort,
    refetch,
  };
};