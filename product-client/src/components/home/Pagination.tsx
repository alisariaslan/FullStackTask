/// src/components/Pagination.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname } from '@/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/shared/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const t = useTranslations('Pagination');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL OLUŞTURUCU HELPER
    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">

            {/* ÖNCEKİ SAYFA LINKI */}
            {currentPage > 1 ? (
                <Link href={createPageUrl(currentPage - 1)} aria-label="Previous Page">
                    <Button variant="outline" className="h-9 px-3 pointer-events-none" tabIndex={-1}>
                        &laquo;
                    </Button>
                </Link>
            ) : (
                <Button variant="outline" className="h-9 px-3" disabled>
                    &laquo;
                </Button>
            )}

            {/* SAYFA NUMARALARI */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Mevcut sayfa ise link olmasın
                const isCurrent = currentPage === page;

                return isCurrent ? (
                    <Button
                        key={page}
                        variant="primary"
                        className="h-9 w-9 p-0 flex items-center justify-center bg-primary text-primary-foreground border-primary"
                        disabled
                    >
                        {page}
                    </Button>
                ) : (
                    <Link key={page} href={createPageUrl(page)}>
                        <div className="h-9 w-9 p-0 flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                            {page}
                        </div>
                    </Link>
                );
            })}

            {/* SONRAKİ SAYFA LINKI */}
            {currentPage < totalPages ? (
                <Link href={createPageUrl(currentPage + 1)} aria-label="Next Page">
                    <Button variant="outline" className="h-9 px-3 pointer-events-none" tabIndex={-1}>
                        &raquo;
                    </Button>
                </Link>
            ) : (
                <Button variant="outline" className="h-9 px-3" disabled>
                    &raquo;
                </Button>
            )}
        </div>
    );
}