/// src/components/Pagination.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { Button } from '../shared/Button';
import { useTranslations } from 'next-intl';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const t = useTranslations('Pagination');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* ÖNCEKİ BUTONU */}
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-9 px-3"
            >
                &laquo;
            </Button>

            {/* SAYFA NUMARALARI */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    className={`h-9 w-9 p-0 flex items-center justify-center ${currentPage === page
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-secondary'
                        }`}
                >
                    {page}
                </Button>
            ))}

            {/* SONRAKİ BUTONU */}
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-9 px-3"
            >
                &raquo;
            </Button>
        </div>
    );
}