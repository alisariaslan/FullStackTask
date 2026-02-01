'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Link, usePathname, useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout, restoreUser } from '@/lib/store/features/auth/authSlice';
import { Button } from './Button';
import { Input } from './Input';
import { useTranslations } from 'next-intl';
import { clearCart } from '@/lib/store/features/cart/cartSlice';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { totalQuantity } = useAppSelector((state) => state.cart);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const [searchQuery, setSearchQuery] = useState(searchParams.get('searchTerm') || '');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            dispatch(restoreUser(JSON.parse(storedUser)));
        }
    }, [dispatch]);

    useEffect(() => {
        const currentParamsTerm = searchParams.get('searchTerm') || '';
        if (currentParamsTerm !== searchQuery) {
            setSearchQuery(currentParamsTerm);
        }
    }, [searchParams]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentTerm = params.get('searchTerm') || '';

            if (searchQuery !== currentTerm) {
                if (searchQuery.trim()) {
                    params.set('searchTerm', searchQuery);
                } else {
                    params.delete('searchTerm');
                }

                if (params.get('page')) {
                    params.delete('page');
                }

                router.push(`/?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, router, searchParams]);

    const handleLogout = () => {
        dispatch(clearCart());
        dispatch(logout());
        localStorage.removeItem('cart_items');
        setIsMobileMenuOpen(false);
        router.push('/');
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
            <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

                <Link href="/" className="text-2xl font-bold text-primary flex-shrink-0 z-20">
                    {t('title')}
                </Link>

                {/* Desktop Search Bar */}
                <form onSubmit={handleFormSubmit} className="flex-1 max-w-md mx-auto hidden md:flex relative">
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder') || "Ürün ara..."}
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </form>

                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

                    <Link href="/cart" className="relative group flex items-center gap-2 text-gray-600 hover:text-primary transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span className="font-medium hidden sm:inline">{t('cart')}</span>
                        {totalQuantity > 0 && (
                            <span className="absolute top-0 right-0 sm:-top-2 sm:-right-2 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-gray-300">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-800 max-w-[150px] truncate">
                                    {user.email}
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
                            <div className="flex gap-2">
                                <Link href="/login">
                                    <Button variant="outline" className="h-9 px-4 hover:bg-secondary hover:text-primary border-border">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="h-9 px-4 bg-primary hover:bg-primary-dark text-primary-foreground transition-all">
                                        {t('register')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar  */}
            <div className="md:hidden px-4 pb-3 border-b border-gray-100">
                <form onSubmit={handleFormSubmit} className="relative">
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </form>
            </div>

            {/* Mobile Menu Overlay  */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl max-h-[90vh] flex flex-col animate-slideDown shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-white rounded-t-2xl">
                            <h2 className="font-semibold text-base">{t('title') || 'Menü'}</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col p-4 space-y-4 overflow-y-auto">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                                        <span className="text-xs text-gray-500">Giriş yapıldı</span>
                                        <span className="text-sm font-semibold text-gray-900">{user.email}</span>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                        {t('logout')}
                                    </Button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login" className="w-full">
                                        <Button variant="outline" className="w-full justify-center">
                                            {t('login')}
                                        </Button>
                                    </Link>
                                    <Link href="/register" className="w-full">
                                        <Button className="w-full justify-center bg-primary hover:bg-primary-dark text-primary-foreground">
                                            {t('register')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}