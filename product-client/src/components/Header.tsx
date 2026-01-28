'use client';

import { useEffect } from 'react';
import { Link } from '@/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout, restoreUser } from '@/lib/store/features/auth/authSlice';
import { Button } from './ui/Button';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations('Navbar');
    const dispatch = useAppDispatch();
    const { totalQuantity } = useAppSelector((state) => state.cart);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            dispatch(restoreUser(JSON.parse(storedUser)));
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    {t('title')}
                </Link>

                {/* Menü Linkleri */}
                <nav className="flex items-center gap-6">

                    {/* Sepet */}
                    <Link href="/cart" className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span className="font-medium">{t('cart')}</span>
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    {/* AUTH */}
                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
                        {isAuthenticated && user ? (
                            // Giriş Yapılmış 
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-800">
                                    {user.username}
                                </span>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="text-xs h-8 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    {t('logout')}
                                </Button>
                            </div>
                        ) : (
                            // Giriş Yapılmamış 
                            <div className="flex gap-2">
                                <Link href="/login">
                                    <Button variant="outline" className="h-9 px-4">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white">
                                        {t('register')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}