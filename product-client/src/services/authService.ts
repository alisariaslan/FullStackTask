
const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL;
};

export const authService = {
    async register(email: string, password: string) {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kayıt başarısız oldu.');
        }

        return response.json();
    },

    async login(email: string, password: string) {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Giriş başarısız. Bilgilerinizi kontrol edin.');
        }

        return response.json();
    }
};