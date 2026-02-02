// src/services/productService.ts
import { apiRequest } from '@/lib/apiHandler';
import { Product, ProductQueryParams, AddProductTranslationInput, GetProductByIdInput } from '@/types/productTypes';
import { PaginatedResult } from '@/types/sharedTypes';

export const productService = {

    // Tüm ürünleri filtreleyerek getir
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

    //  Slug ile ürün getir
    async getBySlug(slug: string, languageCode: string = 'en'): Promise<Product | null> {
        try {
            const endpoint = `/api/Products/by-slug/${slug}?languageCode=${languageCode}`;
            const response = await apiRequest<Product>(endpoint, {
                cache: 'no-store'
            });
            return response;
        } catch (error) {
            return null;
        }
    },

    // Id ile ürün getir
    async getById(params: GetProductByIdInput): Promise<Product> {
        let endpoint = `/api/Products/${params.id}`;

        if (params.languageCode) {
            endpoint += `?LanguageCode=${params.languageCode}`;
        }

        return apiRequest<Product>(endpoint, {
            cache: 'no-store'
        });
    },

    // Ürün oluştur
    async create(
        name: string,
        price: number,
        stock: number,
        categoryId: string,
        description?: string,
        languageCode?: string,
        image?: File | null
    ): Promise<string> {
        const formData = new FormData();

        formData.append('Name', name);
        formData.append('Price', price.toString());
        formData.append('Stock', stock.toString());
        formData.append('CategoryId', categoryId);

        // Opsiyonel alanlar
        if (description) formData.append('Description', description);
        if (languageCode) formData.append('LanguageCode', languageCode);
        if (image) formData.append('Image', image);

        return apiRequest<string>('/api/Products', {
            method: 'POST',
            body: formData,
        });
    },

    // Ürün için çeviri oluştur
    async addTranslation(data: AddProductTranslationInput): Promise<void> {
        return apiRequest<void>(`/api/Products/${data.productId}/translations`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};