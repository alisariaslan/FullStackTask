'use client';

import { Link } from '@/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    removeFromCart,
    decreaseItemQuantity,
    addToCart
} from '@/lib/store/features/cart/cartSlice';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function CartPage() {
    const t = useTranslations('Cart');
    const dispatch = useAppDispatch();
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    // Sepet boşsa gösterilecek
    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('title')}</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    {t('empty')}
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {t('title')}
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Ürün Listesi Sol Taraf */}
                <div className="lg:w-2/3 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm"
                        >
                            {/* Ürün Placeholder */}
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                Resim
                            </div>

                            {/* Ürün Bilgileri */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                <p className="text-green-600 font-medium">₺{item.price}</p>
                            </div>

                            {/* Miktar Kontrolleri */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                <button
                                    onClick={() => dispatch(decreaseItemQuantity(item.id))}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600 font-bold"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                                <button
                                    onClick={() => dispatch(addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price
                                    }))}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600 font-bold"
                                >
                                    +
                                </button>
                            </div>

                            {/* Toplam Fiyat ve Sil Butonu */}
                            <div className="flex flex-col items-end gap-2 min-w-[80px]">
                                <span className="font-bold text-gray-900">
                                    ₺{(item.price * item.quantity).toFixed(2)}
                                </span>

                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                    {t('remove')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sipariş Özeti Sağ Taraf */}
                <div className="lg:w-1/3">
                    <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-24">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('summary')}</h2>

                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>{t('subtotal')}</span>
                            <span>₺{totalAmount.toFixed(2)}</span>
                        </div>

                        <hr className="my-4 border-gray-100" />

                        <div className="flex justify-between mb-6 text-lg font-bold text-gray-900">
                            <span>{t('total')}</span>
                            <span>₺{totalAmount.toFixed(2)}</span>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
                            {t('checkout')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}