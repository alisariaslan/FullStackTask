// src/services/productService.ts
import { apiRequest } from '@/lib/apiHandler';
import { Product, ProductQueryParams, AddProductTranslationInput, GetProductByIdInput } from '@/types/productTypes';
import { PaginatedResult } from '@/types/sharedTypes';

export const productService = {
    // GET: /api/Products?PageNumber=1&LanguageCode=en...
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

    // GET: /api/Products/{id}?LanguageCode=en
    async getById(params: GetProductByIdInput): Promise<Product> {
        let endpoint = `/api/Products/${params.id}`;

        if (params.languageCode) {
            endpoint += `?LanguageCode=${params.languageCode}`;
        }

        return apiRequest<Product>(endpoint, {
            cache: 'no-store'
        });
    },

    // POST: /api/Products
    async create(name: string, price: number, stock: number): Promise<string> {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('stock', stock.toString());

        return apiRequest<string>('/api/Products', {
            method: 'POST',
            body: formData,
        });
    },


    // POST: /api/Products/{id}/translations
    async addTranslation(data: AddProductTranslationInput): Promise<void> {
        return apiRequest<void>(`/api/Products/${data.productId}/translations`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};