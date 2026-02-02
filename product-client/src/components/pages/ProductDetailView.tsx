// src/components/views/ProductDetailView.tsx

import { getTranslations } from 'next-intl/server';
import { getPublicImageUrl } from '@/lib/apiHandler';
import Image from 'next/image';
import ProductDetailActions from '@/components/home/ProductDetailActions';
import { Link } from '@/navigation';
import { Product } from '@/types/productTypes';
import { FiShoppingCart, FiImage } from "react-icons/fi";

interface ProductDetailProps {
    locale: string;
    product: Product;
}

export default async function ProductDetailView({ locale, product }: ProductDetailProps) {
    const t = await getTranslations({ locale, namespace: 'Product' });

    let categorySlug = product.categorySlug;
    let categoryName = product.categoryName;

    // Görsel URL Mantığı
    const rawImageUrl = getPublicImageUrl(product.imageUrl);
    const hasImage = !!rawImageUrl && !rawImageUrl.includes('no-image');
    const displayImage = hasImage ? rawImageUrl : '/no-image.png';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: [displayImage],
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'TRY',
            availability: 'https://schema.org/InStock',
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-secondary/30 py-12 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* BREADCRUMB / NAVİGASYON */}
                    <nav className="mb-8 flex items-center text-sm text-gray-500">
                        {/* Anasayfa / Ürünler Linki */}
                        <Link href={`/`} className="hover:text-primary transition-colors">
                            {t('title')}
                        </Link>

                        {/* Araya Kategori Linki  */}
                        {categorySlug && (
                            <>
                                <span className="mx-2">/</span>
                                <Link
                                    href={`/${categorySlug}`}
                                    className="hover:text-primary transition-colors font-medium text-gray-700"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}

                        <span className="mx-2">/</span>
                        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
                            {product.name}
                        </span>
                    </nav>

                    <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">

                            {/* Görsel ve Sağ Taraf İçerikleri*/}
                            <div className="relative h-[400px] lg:h-[600px] bg-white flex items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-border">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {hasImage ? (
                                        <Image
                                            src={displayImage}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className={`object-contain p-4 transition-all duration-500 ease-in-out group-hover:scale-105
                                                         ${hasImage ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                                                     `}

                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            <FiImage className="w-64 h-64" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SAĞ TARAF */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                {/* Kategori adı */}
                                <Link href={categorySlug ? `/${categorySlug}` : '#'} className="text-primary font-bold uppercase tracking-widest text-sm mb-4 hover:underline w-fit">
                                    {categoryName}
                                </Link>

                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                                    {product.name}
                                </h1>

                                {/* ... Diğer detaylar ... */}
                                <div className="prose prose-gray max-w-none text-gray-600 mb-8 leading-relaxed">
                                    <p>{product.description}</p>
                                </div>

                                <div className="w-full h-px bg-border mb-8"></div>
                                <ProductDetailActions product={product} />
                                {/* ... Footer ikonları ... */}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}