'use client';

import { useState } from 'react';
import { Product } from '@/types/productTypes';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/features/cart/cartSlice';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { getPublicImageUrl } from '@/lib/apiHandler';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations('ProductCard');
    const dispatch = useAppDispatch();

    const [isImageLoading, setIsImageLoading] = useState(true);

    const [isAdding, setIsAdding] = useState(false);

    const imageUrl = getPublicImageUrl(product.imageUrl);

    const handleAddToCart = () => {
        if (isAdding || product.stock <= 0) return;

        setIsAdding(true);

        dispatch(addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
        }));

        toast.success(t('productAdded'));

        // Bir süre sonra butonu tekrar aktif et
        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    return (
        <div className="group border border-border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-background text-foreground flex flex-col justify-between h-full overflow-hidden">

            {/* --- GÖRSEL --- */}
            <div className="w-full h-56 bg-secondary flex items-center justify-center overflow-hidden relative">

                {/* SHIMMER EFEKT */}
                {isImageLoading && imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] z-10" />
                )}

                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // Fade effect
                        className={`object-contain p-4 transition-all duration-500 ease-in-out group-hover:scale-105
                            ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                        `}
                        onLoad={() => setIsImageLoading(false)}
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <span className="text-sm">{t('noImage')}</span>
                    </div>
                )}

                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500/10 text-red-600 border border-red-200 text-xs font-bold px-2 py-1 rounded-full z-20 backdrop-blur-sm">
                        {product.stock}
                    </span>
                )}
            </div>

            {/* --- İÇERİK --- */}
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs text-primary font-bold uppercase tracking-widest mb-2 opacity-80">
                    {product.categoryName}
                </span>

                <h2 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors" title={product.name}>
                    {product.name}
                </h2>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed" title={product.description}>
                    {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex justify-between items-end mb-4">
                        {/* --- Fiyat --- */}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-0.5">Fiyat</span>
                            <span className="text-xl font-bold text-foreground tracking-tight">
                                ₺{product.price.toFixed(2)}
                            </span>
                        </div>
                        {/* --- Stok durum --- */}
                        <span className={`text-sm font-medium px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock > 0 ? t('inStock') : t('outOfStock')}
                        </span>
                    </div>

                    {/* --- Sepete ekle --- */}
                    <Button
                        onClick={handleAddToCart}
                        className={`w-full font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-95 
        ${product.stock > 0 && !isAdding
                                ? 'bg-primary hover:bg-primary-dark text-primary-foreground shadow-md hover:shadow-lg cursor-pointer'
                                : `bg-gray-200  hover:bg-gray-200 text-gray-500 ${isAdding ? 'cursor-default' : 'cursor-not-allowed'}`
                            }
    `}
                        disabled={product.stock <= 0 || isAdding}
                    >
                        {product.stock > 0
                            ? (isAdding ? 'Eklendi' : t('addToCart'))
                            : t('outOfStock')}
                    </Button>
                </div>
            </div>
        </div>
    );
}