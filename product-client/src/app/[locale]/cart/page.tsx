'use client';

import { Link } from '@/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import CartItemCard from '@/components/CartItemCard'; // <--- YENİ BİLEŞEN IMPORT

export default function CartPage() {
    const t = useTranslations('Cart');
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    // Sepet boşsa gösterilecek
    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4 py-20 text-center">
                <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('title')}</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    {t('empty')}
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {t('title')}
                <span className="text-sm font-normal text-gray-500 ml-2">({items.length} ürün)</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Ürün Listesi Sol Taraf */}
                <div className="lg:w-2/3 space-y-4">
                    {items.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                    ))}
                </div>

                {/* Sipariş Özeti Sağ Taraf */}
                <div className="lg:w-1/3">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                            {t('summary')}
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>{t('subtotal')}</span>
                                <span>₺{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Kargo</span>
                                <span className="text-green-600 font-medium">Ücretsiz</span>
                            </div>
                        </div>

                        <hr className="my-6 border-dashed border-gray-200" />

                        <div className="flex justify-between mb-6">
                            <span className="text-lg font-bold text-gray-900">{t('total')}</span>
                            <span className="text-2xl font-bold text-blue-600">₺{totalAmount.toFixed(2)}</span>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 py-4 text-lg font-semibold shadow-blue-100 shadow-xl transition-transform hover:-translate-y-1">
                            {t('checkout')}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 underline">
                                {t('continueShopping')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}