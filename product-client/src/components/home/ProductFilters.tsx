'use client';

import { useRouter, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { Category } from '@/types/categoryTypes';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ProductFiltersProps {
    categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
    const t = useTranslations('Home');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get('categoryId');
    const currentSortBy = searchParams.get('sortBy');

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    /** URL → state senkronu */
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        Object.entries(updates).forEach(([k, v]) =>
            !v ? params.delete(k) : params.set(k, v)
        );

        router.push(`${pathname}?${params.toString()}`);
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');

        const params = new URLSearchParams();
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    };


    /** 🔥 PRICE DEBOUNCER (Navbar ile aynı mantık) */
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilters({
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [minPrice, maxPrice]);

    return (
        <div className="h-full flex flex-col gap-8 p-4">

            {/* KATEGORİLER */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('categories')}
                </h3>

                <div className="flex flex-col space-y-1">
                    <button
                        onClick={() => updateFilters({ categoryId: null })}
                        className={`text-left px-3 py-2 rounded-md text-sm transition-colors
                          ${!currentCategoryId
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'hover:bg-secondary text-foreground/70'}`}
                    >
                        {t('allProducts')}
                    </button>

                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => updateFilters({ categoryId: c.id })}
                            className={`text-left px-3 py-2 rounded-md text-sm transition-colors
                              ${currentCategoryId === c.id
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'hover:bg-secondary text-foreground/70'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-border/50" />

            {/* FİYAT ARALIĞI (AUTO) */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('priceRange')}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₺</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-secondary/50 text-sm outline-none
                                       border border-transparent focus:border-primary/50"
                        />
                    </div>

                    <div className="w-2 h-[1px] bg-border" />

                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₺</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-secondary/50 text-sm outline-none
                                       border border-transparent focus:border-primary/50"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-border/50" />

            {/* SIRALAMA */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('sortBy')}
                </h3>

                <select
                    value={currentSortBy || ''}
                    onChange={e => updateFilters({ sortBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 text-sm cursor-pointer
                               border border-transparent focus:border-primary/50"
                >
                    <option value="">{t('sortDefault')}</option>
                    <option value="price_asc">{t('priceLowToHigh')}</option>
                    <option value="price_desc">{t('priceHighToLow')}</option>
                </select>
            </div>

            {/* FİLTREYİ SIFIRLA */}
            <div className="pt-4 mt-auto">
                <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 rounded-lg text-sm font-semibold
                   border border-border text-foreground/70
                   hover:bg-secondary transition-colors"
                >
                    {t('resetFilters')}
                </button>
            </div>

        </div>
    );
}
