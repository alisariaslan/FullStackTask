import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/ProductCard'; // <-- YENİ BİLEŞENİ İMPORT ET

export default async function Home() {
  const t = await getTranslations();

  let products: Product[] = [];
  let error = null;

  try {
    products = await productService.getAll();
  } catch (e: any) {
    console.error(e);
    error = "API bağlantı hatası: " + (e.message || "Bilinmeyen hata");
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('Product.title')}</h1>

        <Link
          href="/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('Navigation.addProduct')}
        </Link>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              <p>{t('Product.noProducts')}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}