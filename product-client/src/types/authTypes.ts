// src/types/authTypes.ts

// Auth DTO
export interface AuthResponseDto {
    token: string;
    email: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
}