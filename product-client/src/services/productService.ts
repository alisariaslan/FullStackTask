// src/services/productService.ts
import { apiRequest } from '@/lib/api';
import { Product, PaginatedResult, ProductQueryParams } from '@/types';

export const productService = {
    // GET: /api/Products?PageNumber=1&PageSize=10&SortBy=price_desc...
    async getAll(params: ProductQueryParams = {}): Promise<PaginatedResult<Product>> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/api/Products?${queryString}` : '/api/Products';

        return apiRequest<PaginatedResult<Product>>(endpoint, {
            cache: 'no-store'
        });
    },

    // GET: /api/Products/{id}
    async getById(id: string): Promise<Product> {
        return apiRequest<Product>(`/api/Products/${id}`, {
            cache: 'no-store'
        });
    },

    // POST: /api/Products
    async create(data: Omit<Product, 'id'>): Promise<string> {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        return apiRequest<string>('/api/Products', {
            method: 'POST',
            body: formData,
        });
    },
};