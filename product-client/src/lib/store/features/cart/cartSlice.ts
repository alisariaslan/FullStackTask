// src/lib/store/features/cart/cartSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { cartService } from '@/services/cartService';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // API durumları
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    status: 'idle',
};

// --- YARDIMCI FONKSİYONLAR ---
const calculateTotals = (items: CartItem[]) => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { totalQuantity, totalAmount };
};

// --- ASYNC THUNKS (BACKEND İŞLEMLERİ) ---

// Sepeti Backend'den Çek
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const items = await cartService.getCart();
    return items;
});

// Login Olunca Sepetleri Birleştir
export const mergeLocalCart = createAsyncThunk(
    'cart/merge',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;
        const localItems = state.cart.items;

        if (localItems.length > 0) {
            // Local sepeti backend'e gönder
            await cartService.mergeCart(localItems);
        }
        // Birleştirmeden sonra güncel sepeti çek
        dispatch(fetchCart());
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // --- LOCAL VE GUEST İŞLEMLERİ ---

        // F5 yapınca localStorage'dan geri yükler
        restoreCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },

        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.items.push({ ...newItem, quantity: 1 });
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },

        decreaseItemQuantity: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter((item) => item.id !== id);
                } else {
                    existingItem.quantity--;
                }
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalAmount = totals.totalAmount;
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart Başarılı
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // Backend'den gelen veri asıldır
                const totals = calculateTotals(state.items);
                state.totalQuantity = totals.totalQuantity;
                state.totalAmount = totals.totalAmount;
            })
            // Fetch Cart Bekliyor
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            // Fetch Cart Hata
            .addCase(fetchCart.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { addToCart, removeFromCart, decreaseItemQuantity, clearCart, restoreCart } = cartSlice.actions;
export default cartSlice.reducer;