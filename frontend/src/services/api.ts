import axios from 'axios';
import type { Product, PurchaseRequest, PurchaseResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/api-staging/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/api-staging/products/${id}`);
    return response.data;
  },
};

export const adminApi = {
  updatePrice: async (productId: number, price: string): Promise<Product> => {
    const response = await api.put<Product>(
      `/api-staging/admin/products/${productId}/price`,
      { price_usdc: price }
    );
    return response.data;
  },
};

export const purchaseApi = {
  purchase: async (request: PurchaseRequest): Promise<PurchaseResponse> => {
    const response = await api.post<PurchaseResponse>('/api-staging/purchase', request);
    return response.data;
  },
};

