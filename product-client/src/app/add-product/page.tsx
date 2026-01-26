'use client'; // Bu satır zorunlu, çünkü form etkileşimi var (Client Component)

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
    const router = useRouter();

    // Form verilerini tutacak state'ler
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${apiUrl}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                }),
            });

            if (!res.ok) {
                throw new Error('Ürün eklenirken bir hata oluştu.');
            }


            router.refresh(); // Server component verisini yenilemek için
            router.push('/');

        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
            // CORS hatası olma ihtimaline karşı uyarı
            if (err.message === 'Failed to fetch') {
                setError('API erişim hatası! CORS ayarlarının açık olduğundan emin olun.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Ürün Adı
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Örn: Laptop"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Fiyat
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                        Stok Adedi
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Ekleniyor...' : 'Kaydet'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}