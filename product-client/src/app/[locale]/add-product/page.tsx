'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService } from '@/services/productService';

export default function AddProduct() {
    const t = useTranslations('AddProduct');
    const router = useRouter();

    const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await productService.create({
                name: formData.name,
                price: Number(formData.price),
                stock: Number(formData.stock),
            });

            router.refresh();
            router.back();

        } catch (err: any) {
            if (err.message.includes('giriş yapın') || err.message.includes('401')) {
                router.push('/login');
                return;
            }

            const errorMessage = err.message === 'Failed to fetch'
                ? t('errors.apiError')
                : err.message;

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (

        <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">

                {/* Başlık */}
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {t('title')}
                </h1>

                {/* Hata Mesajı */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Ürün Adı */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.name')}
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange(e, 'name')}
                            placeholder={t('placeholders.name')}
                            required
                        />
                    </div>

                    {/* Fiyat */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.price')}
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleChange(e, 'price')}
                            placeholder={t('placeholders.price')}
                            required
                        />
                    </div>

                    {/* Stok */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labels.stock')}
                        </label>
                        <Input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleChange(e, 'stock')}
                            placeholder={t('placeholders.stock')}
                            required
                        />
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-3 mt-4">
                        <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            {loading ? t('buttons.saving') : t('buttons.save')}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {t('buttons.cancel')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}