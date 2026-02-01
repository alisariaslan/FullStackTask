// src/app/[locale]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import ProductDetailView from '@/components/pages/ProductDetailView';
import CategoryListingView from '@/components/pages/CategoryListingView';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;

    // 1. Metadata için önce Ürün kontrolü
    try {
        const product = await productService.getBySlug(slug, locale);
        if (product) {
            return {
                title: product.name,
                description: product.description,
                alternates: { canonical: `/${locale}/${slug}` }
            };
        }
    } catch (e) {
        // Hata yönetimi boş bırakıldı
    }

    // Metadata için Kategori kontrolü
    try {
        const categories = await categoryService.getAll({ languageCode: locale });
        const category = categories.find(c => c.slug === slug || c.id.toString() === slug);
        if (category) {
            return {
                title: category.name,
                alternates: { canonical: `/${locale}/${slug}` }
            };
        }
    } catch (e) {
        // Hata yönetimi boş bırakıldı
    }

    return { title: 'Sayfa Bulunamadı' };
}

export default async function UnifiedPage({ params, searchParams }: Props) {
    const { locale, slug } = await params;
    const searchParamsValue = await searchParams;

    // Önce Kategorileri Kontrol Et
    try {
        const categories = await categoryService.getAll({ languageCode: locale });
        const activeCategory = categories.find(c => c.slug === slug || c.id.toString() === slug);

        // Eğer slug bir kategoriye aitse, Ürün API'sine gitmeye GEREK YOK.
        if (activeCategory) {
            return (
                <CategoryListingView
                    locale={locale}
                    categoryId={activeCategory.id.toString()}
                    categoryName={activeCategory.name}
                    categories={categories}
                    searchParams={searchParamsValue}
                />
            );
        }
    } catch (error) {
        // Kategori  bulunamadı, sessizce geç
    }

    // Kategori değilse, Ürün mü diye kontrol et
    // (Buraya geldiysen slug ya bir üründür ya da geçersizdir)
    try {
        const product = await productService.getBySlug(slug, locale);
        if (product) {
            return <ProductDetailView locale={locale} product={product} />;
        }
    } catch (error) {
        // Ürün de bulunamadı, sessizce geç
    }

    // İkisi de değilse bulunamadı dön
    return notFound();
}