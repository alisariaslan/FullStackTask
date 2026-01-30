import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard'; // <-- YENİ BİLEŞENİ İMPORT ET
import ErrorMessage from '@/components/ErrorMessage';

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

        <Link
          href="/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('addProduct')}
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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