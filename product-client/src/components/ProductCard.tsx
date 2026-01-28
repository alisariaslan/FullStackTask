'use client'; // <-- Hooks kullanacağımız için Client Component olmalı

import { Product } from '@/types';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/features/cart/cartSlice';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations('ProductCard');
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price
        }));
    };

    return (
        <div className="border p-4 rounded shadow bg-white text-gray-800 flex flex-col justify-between h-full">
            <div>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>


                <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
                    <span>{t('noImage')}</span>
                </div>

                <div className="flex justify-between items-center text-gray-600 mb-4">
                    <span className="font-medium">
                        {t('price')}:
                        <span className="text-green-600 ml-1 text-lg">₺{product.price}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                        {t('stock')}: {product.stock}
                    </span>
                </div>
            </div>

            <Button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? t('addToCart') : t('outOfStock')}

            </Button>
        </div>
    );
}