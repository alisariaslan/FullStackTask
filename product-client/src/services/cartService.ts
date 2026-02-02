// src/services/cartService.ts
import { apiRequest } from '@/lib/apiHandler';
import { CartItem } from '@/lib/store/features/cart/cartSlice';

/**
 * NOT: CART MIKROSERVISI TASK KAPSAMI DIŞINDA OLDUĞU İÇİN YAPILMADI.
 * * Şu anlık tüm metodlar kasıtlı olarak hata fırlatıyor.
 * Bu sayede Frontend bileşenlerindeki (ProductCard, StoreProvider) try/catch blokları
 * bu hataları yakalayıp "Offline/Local Mode" (Fallback) mantığını devreye sokuyor.
 */

export const cartService = {
    // Backend'deki sepeti getir
    getCart: async (): Promise<CartItem[]> => {
        return apiRequest<CartItem[]>('/api/Cart', { method: 'GET' });
    },

    // Backend'e ürün ekle
    addToCart: async (item: Omit<CartItem, 'quantity'>): Promise<void> => {
        return apiRequest<void>('/api/Cart/items', {
            method: 'POST',
            body: JSON.stringify(item),
        });
    },

    // Sepetten ürün sil
    removeFromCart: async (id: string): Promise<void> => {
        return apiRequest<void>(`/api/Cart/items/${id}`, {
            method: 'DELETE',
        });
    },

    // Miktar güncelle
    updateQuantity: async (id: string, quantity: number): Promise<void> => {
        return apiRequest<void>('/api/Cart/items/quantity', {
            method: 'PUT',
            body: JSON.stringify({ id, quantity }),
        });
    },

    // Local'deki sepeti backend'e gönderir (Sepet Birleştirme)
    mergeCart: async (localItems: CartItem[]): Promise<void> => {
        return apiRequest<void>('/api/Cart/merge', {
            method: 'POST',
            body: JSON.stringify({ items: localItems }),
        });
    },

    // Sepeti tamamen temizle (Backend tarafında)
    clearCart: async (): Promise<void> => {
        return apiRequest<void>('/api/Cart', {
            method: 'DELETE',
        });
    }
};