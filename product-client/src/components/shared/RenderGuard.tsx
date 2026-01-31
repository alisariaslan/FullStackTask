// src/components/RenderGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/navigation';
import { useAppSelector } from '@/lib/store/hooks';

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {

        // Giriş yapmamışsa login e gönder
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        // Admin değilse ana sayfaya at
        if (user.role !== 'Admin') {
            router.push('/');
            return;
        }

        setIsAuthorized(true);
    }, [isAuthenticated, user, router]);

    if (!isAuthorized) {
        return null;
    }

    // Yetki varsa içeriği göster
    return <>{children}</>;
}