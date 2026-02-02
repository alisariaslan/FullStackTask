// ProductFilters.tsx

'use client';

import { useRouter, usePathname } from '@/navigation';
import { Link } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { Category } from '@/types/categoryTypes';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ProductFiltersProps {
    categories: Category[];
    activeSlug?: string;
}

export default function ProductFilters({ categories, activeSlug }: ProductFiltersProps) {
    const t = useTranslations('Home');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get('sortBy');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    // Kategori Link Oluşturucu
    const createCategoryUrl = (category: Category | null) => {
        if (!category) return '/';
        return `/${category.slug}`;
    };

    // Query Params Güncelleme
    const updateQueryParams = (updates: Record<string, string | null>) => {
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
        router.push(pathname);
    };

    // Fiyat değişimi için Debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            const currentMin = searchParams.get('minPrice') || '';
            const currentMax = searchParams.get('maxPrice') || '';

            if (minPrice !== currentMin || maxPrice !== currentMax) {
                updateQueryParams({
                    minPrice: minPrice || null,
                    maxPrice: maxPrice || null,
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice]);

    return (
        <div className="h-full flex flex-col gap-8 p-4 overflow-y-auto">
            {/* --- KATEGORİ LİSTESİ --- */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('categories')}
                </h3>
                <div className="flex flex-col space-y-1">
                    {/* Tüm Ürünler */}
                    <Link
                        href={createCategoryUrl(null)}
                        className={`text-left px-3 py-2 rounded-md text-sm transition-colors block
                            ${!activeSlug
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'hover:bg-secondary text-foreground/70'}`}
                    >
                        {t('allProducts')}
                    </Link>

                    {/* Dinamik Kategoriler */}
                    {categories.map(c => (
                        <Link
                            key={c.id}
                            href={createCategoryUrl(c)}
                            className={`text-left px-3 py-2 rounded-md text-sm transition-colors block
                                ${activeSlug === c.slug
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'hover:bg-secondary text-foreground/70'}`}
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </div>

            <hr className="border-border/50" />

            {/* --- FİYAT FİLTRESİ --- */}
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
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-secondary/50 text-sm outline-none border border-transparent focus:border-primary/50"
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
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-secondary/50 text-sm outline-none border border-transparent focus:border-primary/50"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-border/50" />

            {/* --- SIRALAMA --- */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('sortBy')}
                </h3>
                <select
                    value={currentSortBy || ''}
                    onChange={e => updateQueryParams({ sortBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 text-sm cursor-pointer border border-transparent focus:border-primary/50"
                >
                    <option value="">{t('sortDefault')}</option>
                    <option value="price_asc">{t('priceLowToHigh')}</option>
                    <option value="price_desc">{t('priceHighToLow')}</option>
                </select>
            </div>

            {/* --- SIFIRLA --- */}
            <div className="pt-4 mt-auto pb-4">
                <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 rounded-lg text-sm font-semibold border border-border text-foreground/70 hover:bg-secondary transition-colors"
                >
                    {t('resetFilters')}
                </button>
            </div>
        </div>
    );
}