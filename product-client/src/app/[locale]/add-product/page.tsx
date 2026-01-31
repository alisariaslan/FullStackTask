'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import ErrorMessage from '@/components/ErrorMessage';
import AdminGuard from '@/components/RenderGuard';
import { Category } from '@/types/categoryTypes';

export default function AddProduct() {
    const t = useTranslations('AddProduct');
    const locale = useLocale();
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: ''
    });

    // Resim ve Kategori State'leri
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Kategorileri Yükle
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll({ languageCode: locale });
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (err) {
                console.error("Categories failed to load", err);
            }
        };
        fetchCategories();
    }, [locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.categoryId) {
            setError(t('Errors.categoryRequired') || "Category is required");
            setLoading(false);
            return;
        }

        try {
            await productService.create(
                formData.name,              // name
                Number(formData.price),     // price
                Number(formData.stock),     // stock
                formData.categoryId,        // categoryId
                formData.description,       // description (opt)
                locale,                     // languageCode (opt)
                selectedImage               // image (opt)
            );

            router.refresh();
            router.back();
        } catch (e: any) {
            if (e.message?.includes('401')) {
                router.push('/login');
                return;
            }
            setError(e.message || t('unknownError'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <AdminGuard>
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">

                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        {t('title')}
                    </h1>

                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.category') || 'Category'}
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.categoryId}
                                onChange={(e) => handleChange(e, 'categoryId')}
                                required
                            >
                                <option value="" disabled>{t('Placeholders.selectCategory') || 'Select a category'}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* İsim */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.name')}
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange(e, 'name')}
                                placeholder={t('Placeholders.name')}
                                required
                            />
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.description') || 'Description'}
                            </label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.description}
                                onChange={(e) => handleChange(e, 'description')}
                                placeholder={t('Placeholders.description') || 'Enter description'}
                                rows={3}
                            />
                        </div>

                        {/* Fiyat */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.price')}
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange(e, 'price')}
                                placeholder={t('Placeholders.price')}
                                required
                            />
                        </div>

                        {/* Stok */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.stock')}
                            </label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => handleChange(e, 'stock')}
                                placeholder={t('Placeholders.stock')}
                                required
                            />
                        </div>

                        {/* Resim */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Labels.image') || 'Product Image'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                {loading ? t('Buttons.saving') : t('Buttons.save')}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                {t('Buttons.cancel')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminGuard>
    );
}