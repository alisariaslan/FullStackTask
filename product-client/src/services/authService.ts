// src/services/authService.ts
import { apiRequest } from '@/lib/api';
import { AuthResponseDto } from '@/types';

export const authService = {
    async register(email: string, password: string): Promise<AuthResponseDto> {
        return apiRequest<AuthResponseDto>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username: email, password: password }),
        });
    },

    async login(email: string, password: string): Promise<AuthResponseDto> {
        return apiRequest<AuthResponseDto>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: email, password: password }),
        });
    }
};