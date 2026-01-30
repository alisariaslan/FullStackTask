// src/types/index.ts

// ApiResponse<T>
export interface ApiResponse<T> {
    isSuccess: boolean;
    message?: string;
    data?: T;
    errors?: string[];
}

// Auth DTO
export interface AuthResponseDto {
    token: string;
    username: string;
}

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

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
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