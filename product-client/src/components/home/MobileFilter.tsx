'use client';

import { useState } from 'react';
import ProductFilters from './ProductFilters';
import { Button } from '@/components/shared/Button';
import { Category } from '@/types/categoryTypes';

interface MobileFilterProps {
    categories: Category[];
    activeSlug?: string;
}

export default function MobileFilter({ categories, activeSlug }: MobileFilterProps) {
    const [open, setOpen] = useState(false);

    // Kategori sayfası mı kontrolü artık activeSlug ile daha kolay yapılabilir
    // veya her zaman "Filtreler" diyebiliriz.
    const buttonText = 'Filtreler & Kategoriler';

    return (
        <>
            <Button
                variant="outline"
                className="w-full flex justify-between"
                onClick={() => setOpen(true)}
            >
                {buttonText}
                <span> ☰</span>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 left-0 right-0 bg-background rounded-b-2xl max-h-[90vh] flex flex-col animate-slideDown shadow-2xl"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-background rounded-t-2xl">
                            <h2 className="font-semibold text-base">{buttonText}</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-0">

                            <ProductFilters categories={categories} activeSlug={activeSlug} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}