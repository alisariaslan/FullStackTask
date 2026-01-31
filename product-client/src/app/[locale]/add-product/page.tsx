// Add-product.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import ErrorMessage from '@/components/shared/ErrorMessage';
import AdminGuard from '@/components/shared/RenderGuard';
import { Category } from '@/types/categoryTypes';

export default function AddProduct() {
    const t = useTranslations('AddProduct');
    const locale = useLocale();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: ''
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll({ languageCode: locale });
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (err) {
                console.error('Categories failed to load', err);
            }
        };
        fetchCategories();
    }, [locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.categoryId) {
            setError(t('Errors.categoryRequired'));
            setLoading(false);
            return;
        }

        try {
            await productService.create(
                formData.name,
                Number(formData.price),
                Number(formData.stock),
                formData.categoryId,
                formData.description,
                locale,
                selectedImage
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: string
    ) => {
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
                <div className="w-full max-w-md p-8 rounded-lg shadow-md border border-border bg-background">

                    <h1 className="text-2xl font-bold mb-6 text-center">
                        {t('title')}
                    </h1>

                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('Labels.category') || 'Category'}
                            </label>
                            <select
                                className="
                                    w-full p-2 rounded-md
                                    bg-background text-foreground
                                    border border-border
                                    focus:outline-none focus:ring-2 focus:ring-primary
                                "
                                value={formData.categoryId}
                                onChange={(e) => handleChange(e, 'categoryId')}
                                required
                            >
                                <option value="" disabled>
                                    {t('Placeholders.selectCategory') || 'Select a category'}
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('Labels.name')}
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange(e, 'name')}
                                placeholder={t('Placeholders.name')}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('Labels.description') || 'Description'}
                            </label>
                            <textarea
                                className="
                                    w-full p-2 rounded-md
                                    bg-background text-foreground
                                    border border-border
                                    focus:outline-none focus:ring-2 focus:ring-primary
                                "
                                value={formData.description}
                                onChange={(e) => handleChange(e, 'description')}
                                rows={3}
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
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

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
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

                        {/* Image */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {t('Labels.image')}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="
                                    block w-full text-sm
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:bg-primary file:text-primary-foreground
                                    hover:file:opacity-90
                                "
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                            >
                                {loading ? t('Buttons.saving') : t('Buttons.save')}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1 border-border hover:bg-secondary"
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
