import { apiRequest } from '@/lib/api';

export const authService = {
    async register(email: string, password: string) {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username: email, password: password }),
        });
    },

    async login(email: string, password: string) {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: email, password: password }),
        });
    }
};