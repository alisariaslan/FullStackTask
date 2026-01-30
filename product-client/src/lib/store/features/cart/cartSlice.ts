import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Ürün Ekleme
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                });
            }

            state.totalQuantity++;
            state.totalAmount += newItem.price;
        },

        // Ürünü Sepetten Çıkarma
        removeFromCart: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== id);
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
            }
        },

        // Adet Azaltma
        decreaseItemQuantity: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter((item) => item.id !== id);
                } else {
                    existingItem.quantity--;
                }
                state.totalQuantity--;
                state.totalAmount -= existingItem.price;
            }
        },

        // Sepeti Temizle
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, decreaseItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;