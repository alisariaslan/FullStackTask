import { ApiResponse } from "@/types/sharedTypes";

export const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        // D2D
        return process.env.GATEWAY_URL;
    } else {
        // B2D
        return process.env.NEXT_PUBLIC_GATEWAY_URL;
    }
};

export const getPublicImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    // Always B2D
    const baseUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;
    return `${baseUrl}${path}`;
};

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
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
            const failMessage =
                (apiResponse.errors && apiResponse.errors.length > 0 ? apiResponse.errors[0] : null) ||
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