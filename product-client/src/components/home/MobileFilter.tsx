'use client';

import { useState } from 'react';
import ProductFilters from './ProductFilters';
import { Button } from '@/components/shared/Button';

export default function MobileFilter({ categories }: any) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                className="w-full flex justify-between"
                onClick={() => setOpen(true)}
            >
                Filtreler
                ☰
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/40">
                    <div
                        className="
                          absolute top-0 left-0 right-0
                          bg-background
                          rounded-b-2xl
                          max-h-[90vh]
                          flex flex-col
                          animate-slideDown
                        "
                    >
                        {/* 🔒 STICKY HEADER */}
                        <div className="
                          sticky top-0 z-10
                          flex items-center justify-between
                          px-4 py-3
                          border-b
                          bg-background
                        ">
                            <h2 className="font-semibold text-base">
                                Filtreler
                            </h2>

                            <button
                                onClick={() => setOpen(false)}
                                className="
                                  w-8 h-8
                                  flex items-center justify-center
                                  rounded-full
                                  hover:bg-secondary
                                  text-lg
                                "
                                aria-label="Filtreleri kapat"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 📜 CONTENT */}
                        <div className="overflow-y-auto">
                            <ProductFilters categories={categories} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
