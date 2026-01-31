// src/components/AddProductButton.tsx
'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function AddProductButton() {
    const t = useTranslations('Home');
    const { user } = useAppSelector((state) => state.auth);

    if (user?.role !== 'Admin') {
        return null;
    }

    return (
        <Link
            href="/add-product"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
            {t('addProduct')}
        </Link>
    );
}