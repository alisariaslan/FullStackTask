// src/types/sharedTypes.ts

// ApiResponse<T>
export interface ApiResponse<T> {
    isSuccess: boolean;
    message?: string;
    data?: T;
    errors?: string[];
}

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
