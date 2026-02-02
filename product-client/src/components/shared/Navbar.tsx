'use client';

import { useEffect, useState, FormEvent } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiLogOut } from 'react-icons/fi';
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

                <Link href="/" className="text-2xl font-bold text-primary shrink-0 z-20">
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
                        <FiSearch size={18} />
                    </button>
                </form>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                    <Link href="/cart" className="relative group flex items-center gap-2 text-gray-600 hover:text-primary transition-colors p-2">
                        <FiShoppingCart size={24} />
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
                        <FiMenu size={24} />
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
                        <FiSearch size={18} />
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
                                        <FiLogOut size={16} className="mr-2" />
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