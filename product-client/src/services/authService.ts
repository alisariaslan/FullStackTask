// src/services/authService.ts
import { apiRequest } from '@/lib/apiHandler';
import { AuthResponseDto, LoginInput, RegisterInput } from '@/types/authTypes';

export const authService = {
    async register(data: RegisterInput): Promise<AuthResponseDto> {
        return apiRequest<AuthResponseDto>('api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async login(data: LoginInput): Promise<AuthResponseDto> {
        return apiRequest<AuthResponseDto>('api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};