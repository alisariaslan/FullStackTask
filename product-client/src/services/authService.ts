// src/services/authService.ts
import { apiRequest } from '@/lib/apiHandler';
import { AuthResponseDto, LoginInput, RegisterInput } from '@/types/authTypes';

export const authService = {
    async register(email: string, password: string): Promise<AuthResponseDto> {
        const payload: RegisterInput = { email, password };
        return apiRequest<AuthResponseDto>('api/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(email: string, password: string): Promise<AuthResponseDto> {
        const payload: LoginInput = { email, password };
        return apiRequest<AuthResponseDto>('api/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
};