import { apiRequest } from '@/lib/api';
import { Product } from '@/types';

export const productService = {
    async getAll(): Promise<Product[]> {
        return apiRequest('/products', {
            cache: 'no-store'
        });
    },

    async create(data: Omit<Product, 'id'>): Promise<Product> {
        return apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};