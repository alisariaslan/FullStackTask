/// ProductCard.tsx

'use client';

import { Product } from '@/types/productTypes';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/features/cart/cartSlice';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { getPublicImageUrl } from '@/lib/apiHandler';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations('ProductCard');
    const dispatch = useAppDispatch();

    const imageUrl = getPublicImageUrl(product.imageUrl);

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
        }));
    };

    return (
        <div className="border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-background text-foreground flex flex-col justify-between h-full overflow-hidden">

            {/* --- GÖRSEL ALANI --- */}
            <div className="w-full h-48 bg-secondary flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <span className="text-sm">{t('noImage')}</span>
                    </div>
                )}

                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded z-10">
                        {product.stock}
                    </span>
                )}
            </div>

            {/* --- İÇERİK ALANI --- */}
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                    {product.categoryName}
                </span>

                <h2 className="text-lg font-bold mb-2 line-clamp-1" title={product.name}>
                    {product.name}
                </h2>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2" title={product.description}>
                    {product.description}
                </p>

                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-2xl font-bold text-foreground">
                            ₺{product.price.toFixed(2)}
                        </span>

                        <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {product.stock > 0 ? t('inStock') : t('outOfStock')}
                        </span>
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        className={`w-full text-primary-foreground transition-colors py-2 rounded-md ${product.stock > 0
                            ? 'bg-primary hover:bg-primary-dark shadow-sm'
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                            }`}
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? t('addToCart') : t('outOfStock')}
                    </Button>
                </div>
            </div>
        </div>
    );
}