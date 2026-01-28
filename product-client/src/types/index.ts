// src/types/index.ts

// ApiResponse<T>
export interface ApiResponse<T> {
    isSuccess: boolean;
    message?: string;
    data?: T;
    errorMessage?: string;
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
    price: number;
    stock: number;
}