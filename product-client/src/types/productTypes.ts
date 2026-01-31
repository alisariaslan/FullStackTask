// src/types/productTypes.ts

// Product DTO
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
    categoryName: string;
}


export interface ProductQueryParams {
    languageCode?: string;
    searchTerm?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface AddProductTranslationInput {
    productId: string;
    languageCode: string;
    name: string;
    description?: string;
}

export interface GetProductByIdInput {
    id: string;
    languageCode?: string;
}