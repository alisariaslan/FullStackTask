import { apiRequest } from '@/lib/apiHandler';
import { Category, CategoryQueryParams, CreateCategoryInput, AddCategoryTranslationInput } from '@/types/categoryTypes';

export const categoryService = {
    // GET: /api/Categories?LanguageCode=tr
    async getAll(params: CategoryQueryParams = {}): Promise<Category[]> {
        const queryParams = new URLSearchParams();
        if (params.languageCode) {
            queryParams.append('LanguageCode', params.languageCode);
        }
        const queryString = queryParams.toString();
        const endpoint = queryString ? `/api/Categories?${queryString}` : '/api/Categories';
        return apiRequest<Category[]>(endpoint, {
            cache: 'no-store'
        });
    },

    // POST: /api/Categories
    async create(data: CreateCategoryInput): Promise<string> {
        return apiRequest<string>('/api/Categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // POST: /api/Categories/{id}/translations
    async addTranslation(data: AddCategoryTranslationInput): Promise<void> {
        return apiRequest<void>(`/api/Categories/${data.categoryId}/translations`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};