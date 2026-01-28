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

        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            throw new Error('ClientErrors.sessionExpired');
        }

        const responseText = await response.text();
        let apiResponse: ApiResponse<T>;

        try {
            apiResponse = JSON.parse(responseText);
        } catch {
            if (!response.ok) {
                console.error(`HTTP Error: ${response.status}`);
                throw new Error('ClientErrors.networkError');
            }
            throw new Error('ClientErrors.invalidResponse');
        }

        if (!apiResponse.isSuccess) {
            const failMessage = apiResponse.errorMessage ||
                (apiResponse.errors && apiResponse.errors[0]) ||
                apiResponse.message ||
                'ClientErrors.unknown';

            throw new Error(failMessage);
        }
        return apiResponse.data as T;

    } catch (error: any) {
        console.error(`Fetch Error on ${url}:`, error);

        if (error.message && (error.message.startsWith('ClientErrors.') || !error.message.includes(' '))) {
            throw error;
        }

        throw new Error('ClientErrors.networkError');
    }
}