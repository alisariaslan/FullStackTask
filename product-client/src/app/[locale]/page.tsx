/// Home.tsx

import { productService } from '@/services/productService';
import { Product } from '@/types/productTypes';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import ErrorMessage from '@/components/ErrorMessage';
import AddProductButton from '@/components/AddProductButton';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  let products: Product[] = [];
  let error = null;

  try {
    const result = await productService.getAll();
    products = result.items;
  } catch (e: any) {
    error = e.message || t('unknownError');
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t('title')}
        </h1>

        <AddProductButton />
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              <p>{t('noProducts')}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}