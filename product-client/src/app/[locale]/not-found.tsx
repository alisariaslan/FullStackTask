'use client';


import { FiX } from 'react-icons/fi';
import { Button } from '@/components/shared/Button';
import { Link } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Head from 'next/head';

export default function NotFound() {
    const t = useTranslations('NotFound');
    const locale = useLocale();

    return (

        <>
            <Head>
                <title>{t('metaTitle')}</title>
                <meta name="description" content={t('metaDescription')} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="container mx-auto p-4 py-20 text-center">
                <div className="bg-secondary rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <FiX size={48} className="text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">404</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    {t('message')}
                </p>
                <Link href="/">
                    <Button className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-dark transition shadow-lg shadow-orange-200">
                        {t('goHome')}
                    </Button>
                </Link>
            </div>
        </>
    );
}
