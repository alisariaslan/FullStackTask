// Home.tsx

import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Product, ProductQueryParams } from '@/types/productTypes';
import { Category } from '@/types/categoryTypes';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/home/ProductCard';
import AddProductButton from '@/components/home/AddProductButton';
import Pagination from '@/components/home/Pagination';
import ProductFilters from '@/components/home/ProductFilters';
import MobileFilter from '@/components/home/MobileFilter';
import { Metadata } from 'next';

// Sayfaya özel Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Home' });

  const searchTerm = typeof query.searchTerm === 'string' ? query.searchTerm : undefined;
  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : undefined;
  const minPrice = typeof query.minPrice === 'string' ? parseFloat(query.minPrice) : undefined;
  const maxPrice = typeof query.maxPrice === 'string' ? parseFloat(query.maxPrice) : undefined;
  const page = typeof query.page === 'string' ? parseInt(query.page) : 1;

  const filterParams: ProductQueryParams = {
    languageCode: locale,
    searchTerm,
    categoryId: undefined,
    minPrice,
    maxPrice,
    sortBy,
    pageNumber: page,
    pageSize: 12,
  };

  let products: Product[] = [];
  let totalPages = 0;
  let categories: Category[] = [];

  try {
    const [productsResult, categoriesResult] = await Promise.all([
      productService.getAll(filterParams),
      categoryService.getAll({ languageCode: locale }),
    ]);

    products = productsResult.items;
    totalPages = productsResult.totalPages;
    categories = categoriesResult;
  } catch (e: any) {
    console.error(e);
  }

  // JSON-LD Schema (ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': products.map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${product.id}`,
      'name': product.name,
      'image': product.imageUrl,
      'offers': {
        '@type': 'Offer',
        'price': product.price,
        'priceCurrency': 'TRY'
      }
    }))
  };

  return (
    <main className="relative">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <aside className="hidden lg:block fixed top-20 left-0 w-72 h-[calc(100vh-5rem)] border-r border-border bg-background z-40">
        <ProductFilters categories={categories} />
      </aside>

      <section className="lg:pl-72">
        <div className="max-w-1xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {searchTerm ? (
                <span className="flex items-center gap-2">
                  {t('searchResultsFor')} <span className="text-primary">"{searchTerm}"</span>
                </span>
              ) : (
                t('title')
              )}
            </h1>
            <AddProductButton />
          </div>

          <div className="lg:hidden mb-4">
            <MobileFilter categories={categories} />
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 6} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 mb-12">
                  <Pagination currentPage={page} totalPages={totalPages} />
                </div>
              )}
            </>
          ) : (
            <div className="mt-10 col-span-full text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
              <p className="text-xl font-medium mb-2">{t('noProducts')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}