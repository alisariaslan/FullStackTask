import { Product } from '@/types';

const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL;
};

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
    }
    return response.json();
}

export const productService = {
    async getAll(): Promise<Product[]> {
        const baseUrl = getBaseUrl();
        console.log(`Fetching from: ${baseUrl}/products`);

        const res = await fetch(`${baseUrl}/products`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return handleResponse<Product[]>(res);
    },

    async create(data: Omit<Product, 'id'>): Promise<Product> {
        const baseUrl = getBaseUrl();

        const res = await fetch(`${baseUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Product>(res);
    },
};