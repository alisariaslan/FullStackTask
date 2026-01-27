'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store/store';
import { restoreUser } from '@/lib/store/features/auth/authSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    storeRef.current?.dispatch(restoreUser({ ...user, token }));
                } catch (e) {
                    console.error("User parse error", e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        }
    }, []);

    return <Provider store={storeRef.current!}>{children}</Provider>;
}