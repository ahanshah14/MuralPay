import axios from 'axios';
import type { Product, PurchaseRequest, PurchaseResponse, ProductUpdate } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/api/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};

export const adminApi = {
  updatePrice: async (productId: number, price: string): Promise<Product> => {
    const response = await api.put<Product>(
      `/api/admin/products/${productId}/price`,
      { price_usdc: price }
    );
    return response.data;
  },
};

export const purchaseApi = {
  purchase: async (request: PurchaseRequest): Promise<PurchaseResponse> => {
    const response = await api.post<PurchaseResponse>('/api/purchase', request);
    return response.data;
  },
};

