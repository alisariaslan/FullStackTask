import { ApiResponse } from "@/types";

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
    return process.env.API_URL || 'http://product_api:8080/api';
};

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    } as HeadersInit;

    const url = `${getBaseUrl()}${cleanEndpoint}`;

    console.log(`API Request (${typeof window === 'undefined' ? 'Server' : 'Client'}): ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // 401 Unauthorized Kontrolü
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            throw new Error('Oturum süresi doldu, lütfen tekrar giriş yapın.');
        }

        const responseText = await response.text();
        let apiResponse: ApiResponse<T>;

        try {
            apiResponse = JSON.parse(responseText);
        } catch {
            if (!response.ok) throw new Error(responseText || `HTTP Hata: ${response.status}`);
            return {} as T; // Beklenmedik durum
        }

        // Backend Logic Kontrolü
        if (!apiResponse.isSuccess) {
            const errorMessage = apiResponse.message ||
                (apiResponse.errors && apiResponse.errors[0]) ||
                'Bilinmeyen bir hata oluştu.';
            throw new Error(errorMessage);
        }

        // Başarılı ise
        return apiResponse.data;

    } catch (error: any) {
        console.error(`Fetch Error on ${url}:`, error);
        throw error;
    }
}