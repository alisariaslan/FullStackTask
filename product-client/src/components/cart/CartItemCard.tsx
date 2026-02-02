// CartItemCard.tsx

'use client';

import { useState } from 'react';
import { FiImage, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch } from '@/lib/store/hooks';
import {
    removeFromCart,
    decreaseItemQuantity,
    addToCart
} from '@/lib/store/features/cart/cartSlice';
import { useTranslations, useLocale } from 'next-intl';
import { getPublicImageUrl } from '@/lib/apiHandler';
import Image from 'next/image';

interface CartItemProps {
    product: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string;
        categoryName?: string;
    },
    priority?: boolean;
}

export default function CartItemCard({ product, priority = false }: CartItemProps) {
    const t = useTranslations('Cart');
    const locale = useLocale();
    const dispatch = useAppDispatch();

    const [isImageLoading, setIsImageLoading] = useState(true);

    // Fiyat formatlayıcı
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const rawImageUrl = getPublicImageUrl(product.imageUrl);

    const hasImage =
        !!rawImageUrl && !rawImageUrl.includes('no-image');

    const displayImage = hasImage
        ? rawImageUrl
        : '/no-image.png';


    return (
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">

            {/* --- GÖRSEL ALANI --- */}
            <div className="w-24 h-24 bg-secondary rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-border">

                {/* Shimmer  */}
                {isImageLoading && hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] z-10" />
                )}

                {hasImage ? (
                    // Resim VARSA Image Component render et
                    <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-contain p-4 transition-all duration-500 ease-in-out group-hover:scale-105
                                              ${isImageLoading && hasImage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                                            `}
                        onLoad={() => setIsImageLoading(false)}
                        // Priority prop'u LCP uyarısını çözer 
                        priority={priority}
                        loading={priority ? undefined : "lazy"}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                        <FiImage className="w-16 h-16" />
                    </div>
                )}
            </div>

            {/* --- BİLGİ ALANI --- */}
            <div className="flex-1 text-center sm:text-left w-full">

                {/* Kategori Adı Gösterimi */}
                {product.categoryName && (
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 block">
                        {product.categoryName}
                    </span>
                )}

                <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-primary font-medium mt-1">
                    ₺{formatPrice(product.price)}
                </p>
            </div>

            {/* --- MİKTAR VE SİLME BUTONLARI --- */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">

                {/* Miktar Kontrolü */}
                <div className="flex items-center gap-3 bg-secondary rounded-lg p-1 border border-border">
                    <button
                        onClick={() => dispatch(decreaseItemQuantity(product.id))}
                        className="w-8 h-8 flex items-center justify-center bg-background rounded shadow-sm hover:bg-gray-100 text-foreground font-bold transition-colors"
                        aria-label="Azalt"
                    >
                        -
                    </button>
                    <span className="w-8 text-center font-bold text-foreground">
                        {product.quantity}
                    </span>
                    <button
                        onClick={() => dispatch(addToCart({ ...product }))}
                        className="w-8 h-8 flex items-center justify-center bg-background rounded shadow-sm hover:bg-gray-100 text-primary font-bold transition-colors"
                        aria-label="Artır"
                    >
                        +
                    </button>
                </div>

                {/* Toplam Fiyat ve Sil */}
                <div className="flex flex-col items-center sm:items-end min-w-[80px]">
                    <span className="font-bold text-foreground text-lg">
                        ₺{formatPrice(product.price * product.quantity)}
                    </span>

                    <button
                        onClick={() => dispatch(removeFromCart(product.id))}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1 transition-colors group"
                    >
                        <FiTrash2
                            size={16}
                            className="group-hover:stroke-red-700"
                        />
                        <span className="underline decoration-transparent group-hover:decoration-red-700">
                            {t('remove')}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}