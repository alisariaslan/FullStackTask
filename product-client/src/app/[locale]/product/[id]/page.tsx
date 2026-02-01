import { productService } from '@/services/productService';
import { getTranslations } from 'next-intl/server';
import { getPublicImageUrl } from '@/lib/apiHandler';
import Image from 'next/image';
import ProductDetailActions from '@/components/home/ProductDetailActions';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';

interface Props {
    params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'Product' }); // Veya 'ProductDetail'

    let product = null;
    try {
        product = await productService.getById({ id, languageCode: locale });
    } catch (error) {
        console.error("Product fetch error:", error);
    }

    if (!product) {
        return notFound();
    }

    // Görsel URL Mantığı
    const rawImageUrl = getPublicImageUrl(product.imageUrl);

    const hasImage =
        !!rawImageUrl && !rawImageUrl.includes('no-image');

    const displayImage = hasImage
        ? rawImageUrl
        : '/no-image.png';

    return (
        <main className="min-h-screen bg-secondary/30 py-12 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* BREADCRUMB / GERİ DÖN */}
                <nav className="mb-8 flex items-center text-sm text-gray-500">
                    <Link href={`/`} className="hover:text-primary transition-colors">
                        {t('title')}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium truncate">{product.name}</span>
                </nav>

                <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">

                        {/* SOL TARA: GÖRSEL */}
                        <div className="relative h-[400px] lg:h-[600px] bg-white flex items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-border">
                            <div className="relative w-full h-full flex items-center justify-center">
                                {hasImage ? (
                                    // Resim VARSA: Next.js Image Component render et
                                    <Image
                                        src={displayImage!}
                                        alt={product.name}
                                        fill
                                        priority
                                        className="object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    // Resim YOKSA SVG render et
                                    <div className="flex flex-col items-center justify-center text-gray-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-32 h-32 mb-4"
                                        >
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SAĞ TARAF: BİLGİLER */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
                                {product.categoryName}
                            </span>

                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                                {product.name}
                            </h1>

                            <div className="prose prose-gray max-w-none text-gray-600 mb-8 leading-relaxed">
                                <p>{product.description}</p>
                            </div>

                            <div className="w-full h-px bg-border mb-8"></div>

                            {/*  Fiyat ve Sepete Ekle Butonu */}
                            <ProductDetailActions product={product} />

                            {/* Ek Bilgiler */}
                            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    <span>{t('safePayment')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    <span>{t('24hourSupport')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}