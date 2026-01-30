'use client';

import { useAppDispatch } from '@/lib/store/hooks';
import {
    removeFromCart,
    decreaseItemQuantity,
    addToCart
} from '@/lib/store/features/cart/cartSlice';
import { useTranslations } from 'next-intl';
import { getPublicImageUrl } from '@/lib/api';

// Sepetteki ürün tipi (Redux state'inizdeki tipe uygun olmalı)
interface CartItemProps {
    item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string;
    };
}

export default function CartItemCard({ item }: CartItemProps) {
    const t = useTranslations('Cart'); // Veya genel bir translation dosyası
    const dispatch = useAppDispatch();

    // Helper fonksiyonu kullanarak güvenli URL alıyoruz
    const imageUrl = getPublicImageUrl(item.imageUrl);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

            {/* --- GÖRSEL ALANI --- */}
            <div className="w-24 h-24 bg-gray-50 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-gray-400 text-xs text-center px-2">
                        Resim Yok
                    </span>
                )}
            </div>

            {/* --- BİLGİ ALANI --- */}
            <div className="flex-1 text-center sm:text-left w-full">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {item.name}
                </h3>
                <p className="text-blue-600 font-medium mt-1">
                    ₺{item.price.toFixed(2)}
                </p>
            </div>

            {/* --- MİKTAR VE SİLME BUTONLARI --- */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">

                {/* Miktar Kontrolü */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                        onClick={() => dispatch(decreaseItemQuantity(item.id))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                        aria-label="Azalt"
                    >
                        -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => dispatch(addToCart({ ...item }))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:bg-blue-50 text-blue-600 font-bold transition-colors"
                        aria-label="Artır"
                    >
                        +
                    </button>
                </div>

                {/* Toplam Fiyat ve Sil */}
                <div className="flex flex-col items-center sm:items-end min-w-[80px]">
                    <span className="font-bold text-gray-900 text-lg">
                        ₺{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1 transition-colors group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                            className="group-hover:stroke-red-700"
                        >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        <span className="underline decoration-transparent group-hover:decoration-red-700">
                            Sil
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}