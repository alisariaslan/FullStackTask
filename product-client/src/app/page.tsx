import { Product } from '@/types';
import Link from 'next/link';

// Ürünleri getir
async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  // API'ye istek atılıyor -> 'no-store' cache tutmamasını sağlar (veriler hep taze gelir).
  const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function Home() {
  let products: Product[] = [];
  let error = null;

  try {
    products = await getProducts();
  } catch (e) {
    console.error(e);
    error = "API'ye bağlanılamadı. Backend'in çalıştığından ve CORS ayarının açık olduğundan emin olun.";
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürün Listesi</h1>
        <Link
          href="/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Yeni Ürün Ekle
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
              <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition bg-white text-gray-800">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Fiyat: ₺{product.price}</span>
                  <span>Stok: {product.stock}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Henüz hiç ürün eklenmemiş.</p>
          )}
        </div>
      )}
    </main>
  );
}