// src/services/productService.ts
import { apiRequest } from '@/lib/api';
import { Product } from '@/types';

export const productService = {
    async getAll(): Promise<Product[]> {
        return apiRequest<Product[]>('/products', {
            cache: 'no-store'
        });
    },

    async create(data: Omit<Product, 'id'>): Promise<string> {
        return apiRequest<string>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};