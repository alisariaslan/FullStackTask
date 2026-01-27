'use client';

import { Link } from '@/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations('Navigation'); // en.json/tr.json içine Navigation eklemelisin
    const cartQuantity = useAppSelector((state) => state.cart.totalQuantity);

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    E-Ticaret
                </Link>

                {/* Menü Linkleri */}
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
                        {t('home') || 'Anasayfa'}
                    </Link>

                    {/* Sepet Linki */}
                    <Link href="/cart" className="relative group">
                        <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            {/* Basit SVG Sepet İkonu */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>

                            <span className="font-medium">{t('cart') || 'Sepet'}</span>
                        </div>

                        {/* Kırmızı Bildirim (Badge) */}
                        {cartQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartQuantity}
                            </span>
                        )}
                    </Link>

                    {/* Login/Register Linkleri */}
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                        <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                            {t('login') || 'Giriş'}
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}