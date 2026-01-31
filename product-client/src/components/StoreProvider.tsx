'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store/store';
import { restoreUser } from '@/lib/store/features/auth/authSlice';
import { restoreCart, fetchCart, mergeLocalCart } from '@/lib/store/features/cart/cartSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const store = storeRef.current!;

            // ÖNCE LOCAL VERİYİ YÜKLE
            const savedCart = localStorage.getItem('cart_items');
            if (savedCart) {
                try {
                    const items = JSON.parse(savedCart);
                    if (Array.isArray(items) && items.length > 0) {
                        store.dispatch(restoreCart(items));
                    }
                } catch (e) {
                    console.error("Cart load error", e);
                }
            }

            // AUTH KONTROLÜ VE SENKRONİZASYON
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    store.dispatch(restoreUser({ ...user, token }));

                    // Local veri yüklendiyse state dolu olacaktır.
                    const currentState = store.getState();

                    if (currentState.cart.items.length > 0) {
                        // Eğer elimizde (localden gelen) ürün varsa, bunları Backend ile birleştir.
                        store.dispatch(mergeLocalCart());
                    } else {
                        // Elimiz boşsa direkt Backend'dekileri getir.
                        store.dispatch(fetchCart());
                    }

                } catch (e) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            // YEDEKLE (Her zaman)
            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                const { items } = state.cart;
                localStorage.setItem('cart_items', JSON.stringify(items));
            });

            return () => {
                unsubscribe();
            };
        }
    }, []);

    return <Provider store={storeRef.current!}>{children}</Provider>;
}