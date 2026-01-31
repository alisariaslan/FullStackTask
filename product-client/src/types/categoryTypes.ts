// src/types/categoryTypes.ts

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface CreateCategoryInput {
    name: string;
    languageCode?: string;
}

export interface AddCategoryTranslationInput {
    categoryId: string;
    languageCode: string;
    name: string;
}

export interface CategoryQueryParams {
    languageCode?: string;
}