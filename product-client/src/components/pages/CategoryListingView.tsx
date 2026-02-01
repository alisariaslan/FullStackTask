import { productService } from '@/services/productService';
import { Product, ProductQueryParams } from '@/types/productTypes';
import { Category } from '@/types/categoryTypes';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/home/ProductCard';
import Pagination from '@/components/home/Pagination';
import ProductFilters from '@/components/home/ProductFilters';
import MobileFilter from '@/components/home/MobileFilter';

interface CategoryListingProps {
    locale: string;
    categoryId: string;
    categoryName: string;
    categories: Category[];
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryListingView({
    locale,
    categoryId,
    categoryName,
    categories,
    searchParams
}: CategoryListingProps) {
    const t = await getTranslations({ locale, namespace: 'Home' });

    // Aktif kategoriyi bul (Sidebar'da highlight etmek için)
    const activeCategory = categories.find(c => c.id.toString() === categoryId);
    const activeSlug = activeCategory ? activeCategory.slug : undefined;

    // SearchParams işlemleri
    const searchTerm = typeof searchParams.searchTerm === 'string' ? searchParams.searchTerm : undefined;
    const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : undefined;
    const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

    const filterParams: ProductQueryParams = {
        languageCode: locale,
        categoryId: categoryId,
        searchTerm,
        minPrice,
        maxPrice,
        sortBy,
        pageNumber: page,
        pageSize: 12,
    };

    let products: Product[] = [];
    let totalPages = 0;

    try {
        const productsResult = await productService.getAll(filterParams);
        products = productsResult.items;
        totalPages = productsResult.totalPages;
    } catch (e: any) {
        console.error(e);
    }

    // JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': products.map((product, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'url': `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${product.slug}`,
            'name': product.name
        }))
    };

    return (
        <main className="relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed top-20 left-0 w-72 h-[calc(100vh-5rem)] border-r border-border bg-background z-40">
                <ProductFilters
                    categories={categories}
                    activeSlug={activeSlug}
                />
            </aside>

            <section className="lg:pl-72">
                <div className="max-w-1xl mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {categoryName || t('title')}
                        </h1>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-4">
                        <MobileFilter
                            categories={categories}
                            activeSlug={activeSlug}
                        />
                    </div>

                    {products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                                {products.map((product, index) => (
                                    <ProductCard key={product.slug} product={product} priority={index < 6} />
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