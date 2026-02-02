// CartPage.tsx

'use client';

import { FiShoppingCart } from 'react-icons/fi';
import { Link } from '@/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/shared/Button';
import { useTranslations, useLocale } from 'next-intl';
import CartItemCard from '@/components/cart/CartItemCard';
import Head from 'next/head';

export default function CartPage() {
    const t = useTranslations('Cart');
    const locale = useLocale();
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    // Fiyat formatlayıcı fonksiyon
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Sepet boşsa gösterilecek
    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4 py-20 text-center">
                <div className="bg-secondary rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <FiShoppingCart size={48} className="text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{t('title')}</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    {t('empty')}
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-dark transition shadow-lg shadow-orange-200"
                >
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <>

            <Head>
                <title>{t('metaTitle')}</title>
                <meta name="description" content={t('metaDescription')} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>


            <div className="container mx-auto p-4 max-w-6xl">
                <h1 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <FiShoppingCart size={24} />
                    {t('title')}
                    <span className="text-sm font-normal text-gray-500 ml-2">({items.length} ürün)</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Ürün Listesi Sol Taraf */}
                    <div className="lg:w-2/3 space-y-4">
                        {items.map((item, index) => (
                            <CartItemCard
                                key={item.id}
                                product={item}
                                // LCP uyarısı için ilk 6 item'ı öncelikli yüklüyoruz
                                priority={index < 6}
                            />
                        ))}
                    </div>

                    {/* Sipariş Özeti Sağ Taraf */}
                    <div className="lg:w-1/3">
                        <div className="bg-background border border-border rounded-lg p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">
                                {t('summary')}
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('subtotal')}</span>
                                    {/* Formatlanmış Ara Toplam */}
                                    <span>₺{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Kargo</span>
                                    <span className="text-green-600 font-medium">Ücretsiz</span>
                                </div>
                            </div>

                            <hr className="my-6 border-dashed border-border" />

                            <div className="flex justify-between mb-6">
                                <span className="text-lg font-bold text-foreground">{t('total')}</span>
                                {/* Formatlanmış Genel Toplam */}
                                <span className="text-2xl font-bold text-primary">₺{formatPrice(totalAmount)}</span>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-4 text-lg font-semibold shadow-xl transition-transform hover:-translate-y-1">
                                {t('checkout')}
                            </Button>

                            <div className="mt-4 text-center">
                                <Link href="/" className="text-sm text-gray-500 hover:text-foreground underline">
                                    {t('continueShopping')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}