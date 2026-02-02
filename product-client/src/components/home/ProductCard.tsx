// ProductCard.tsx

"use client";

import { useState } from "react";
import { Product } from "@/types/productTypes";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart, fetchCart } from "@/lib/store/features/cart/cartSlice";
import { Button } from "@/components/shared/Button";
import { useTranslations, useLocale } from "next-intl";
import { getPublicImageUrl } from "@/lib/apiHandler";
import Image from "next/image";
import { toast } from "sonner";
import { cartService } from "@/services/cartService";
import { Link } from "@/navigation";
import { FiShoppingCart, FiImage } from "react-icons/fi";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export default function ProductCard({
    product,
    priority = false,
}: ProductCardProps) {
    const t = useTranslations("ProductCard");
    const locale = useLocale();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Fiyat formatlayıcı
    const formatPrice = (value: number) => {
        if (Number.isInteger(value)) {
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        }

        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const rawImageUrl = getPublicImageUrl(product.imageUrl);

    const hasImage = !!rawImageUrl && !rawImageUrl.includes("no-image");

    const displayImage = hasImage ? rawImageUrl : "/no-image.png";

    // Stok kontrolü
    const isLowStock = product.stock > 0 && product.stock < 10;

    // Stokta yok veya ekleme yapılıyorsa buton pasif olsun
    const isButtonDisabled = product.stock <= 0 || isAdding;

    const handleAddToCart = async () => {
        if (isButtonDisabled) return;

        setIsAdding(true);

        const itemDto = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            categoryName: product.categoryName,
        };

        try {
            if (isAuthenticated) {
                await cartService.addToCart(itemDto);
                dispatch(fetchCart());
                toast.success(t("productAdded"));
            } else {
                dispatch(addToCart(itemDto));
                toast.success(t("productAdded"));
            }
        } catch (error) {
            const isSilentMode =
                process.env.NEXT_PUBLIC_SILENT_CART_MERGE_ERRORS === "1";
            if (!isSilentMode) console.error(t("addErrorBackend"), error);
            dispatch(addToCart(itemDto));
            toast.warning(t("tempAdded"));
        } finally {
            setTimeout(() => {
                setIsAdding(false);
            }, 500);
        }
    };

    return (
        <div className="group border border-border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-background text-foreground flex flex-col justify-between h-full overflow-hidden">
            <Link href={`/${product.slug}`} className="block">
                {/* --- GÖRSEL --- */}
                <div className="w-full h-56 bg-secondary flex items-center justify-center overflow-hidden relative">
                    {/* Yükleniyor efekti sadece gerçek resim varsa ve henüz yüklenmediyse görünsün */}
                    {isImageLoading && hasImage && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] z-10" />
                    )}
                    {hasImage ? (
                        <Image
                            src={displayImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`object-contain p-4 transition-all duration-500 ease-in-out group-hover:scale-105
                        ${isImageLoading && hasImage ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                    `}
                            onLoad={() => setIsImageLoading(false)}
                            priority={priority}
                            loading={priority ? undefined : "lazy"}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300">
                            <FiImage className="w-32 h-32" />
                        </div>
                    )}
                </div>
            </Link>

            {/* --- İÇERİK --- */}
            <div className="p-5 flex flex-col grow">
                <span className="text-xs text-primary font-bold uppercase tracking-widest mb-2 opacity-80">
                    {product.categoryName}
                </span>

                <h2
                    className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors"
                    title={product.name}
                >
                    {product.name}
                </h2>

                <p
                    className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed"
                    title={product.description}
                >
                    {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex justify-between items-end mb-4">
                        {/* --- Fiyat --- */}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-0.5">
                                {t("price")}
                            </span>
                            <span className=" text-sm md:text-xl font-bold text-foreground tracking-tight">
                                ₺{formatPrice(product.price)}
                            </span>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            disabled={isButtonDisabled}
                            isLoading={isAdding}
                            className={`w-16 ${isLowStock ? "animate-bounce" : ""} shadow-md`}
                            variant="ghost"
                        >
                            <FiShoppingCart size={20} />
                        </Button>
                    </div>
                    {/* --- Stok Az Kaldı Uyarısı Metni --- */}
                    {isLowStock && (
                        <p className="text-xs text-red-500 font-medium text-center mt-2">
                            {t("almostOutOfStok")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
