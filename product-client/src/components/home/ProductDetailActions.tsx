'use client';

import { useState } from 'react';
import { Product } from '@/types/productTypes';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { addToCart, fetchCart } from '@/lib/store/features/cart/cartSlice';
import { cartService } from '@/services/cartService';
import { Button } from '@/components/shared/Button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ProductDetailActions({ product }: { product: Product }) {
    const t = useTranslations('ProductCard');
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [isAdding, setIsAdding] = useState(false);

    const isButtonDisabled = product.stock <= 0 || isAdding;

    const handleAddToCart = async () => {
        if (isButtonDisabled) return;
        setIsAdding(true);

        const itemDto = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
        };

        try {
            if (isAuthenticated) {
                await cartService.addToCart(itemDto);
                dispatch(fetchCart());
                toast.success(t('productAdded'));
            } else {
                dispatch(addToCart(itemDto));
                toast.success(t('productAdded'));
            }
        } catch (error) {
            dispatch(addToCart(itemDto));
            toast.warning(t('tempAdded'));
        } finally {
            setTimeout(() => setIsAdding(false), 500);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                <span className="text-2xl font-bold text-primary">
                    ₺{product.price.toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {product.stock > 0 ? t('inStock') : t('outOfStock')}
                </span>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                isLoading={isAdding}
                variant="primary"
                className="w-full py-6 text-lg shadow-lg shadow-primary/20"
            >
                {product.stock > 0
                    ? (isAdding ? t('added') : t('addToCart'))
                    : t('outOfStock')}
            </Button>

            {product.stock > 0 && product.stock < 10 && (
                <p className="text-sm text-red-500 font-medium text-center">
                    Son {product.stock} ürün kaldı!
                </p>
            )}
        </div>
    );
}