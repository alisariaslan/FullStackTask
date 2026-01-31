/// Home.tsx
import { productService } from '@/services/productService';
import { Product } from '@/types/productTypes';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import ErrorMessage from '@/components/ErrorMessage';
import AddProductButton from '@/components/AddProductButton';
import Pagination from '@/components/Pagination';

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;

  const query = await searchParams;
  const searchTerm = typeof query.searchTerm === 'string' ? query.searchTerm : undefined;

  const page = typeof query.page === 'string' ? parseInt(query.page) : 1;
  const pageSize = 36;

  const t = await getTranslations({ locale, namespace: 'Home' });

  let products: Product[] = [];
  let totalPages = 0;
  let error = null;

  try {
    const result = await productService.getAll({
      searchTerm: searchTerm,
      pageNumber: page,
      pageSize: pageSize
    });

    products = result.items;
    totalPages = result.totalPages;

  } catch (e: any) {
    error = e.message || t('unknownError');
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {searchTerm ? (
            <span className="flex items-center gap-2">
              {t('searchResultsFor')}
              <span className="text-primary">"{searchTerm}"</span>
            </span>
          ) : t('title')}
        </h1>

        <AddProductButton />
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <>
          {/* animate-fade-in sınıfı buraya eklendi */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-300"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <p className="text-xl font-medium mb-2">{t('noProducts')}</p>
                  {searchTerm && (
                    <p className="text-base text-gray-400">
                      "{searchTerm}" {t('noResultsMessage')}
                    </p>
                  )}
                  {(searchTerm || page > 1) && (
                    <Link href="/" className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                      {t('clearSearch')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="mt-10">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </main>
  );
}