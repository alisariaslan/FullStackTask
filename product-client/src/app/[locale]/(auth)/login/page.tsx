'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/features/auth/authSlice';
import { mergeLocalCart } from '@/lib/store/features/cart/cartSlice'; // <--- YENİ IMPORT
import { Link } from '@/navigation';
import ErrorMessage from '@/components/ErrorMessage';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const t = useTranslations('Login');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(formData.email, formData.password);

            const decoded: any = jwtDecode(response.token);
            const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const userRole = decoded[roleKey] || decoded.role || "User";

            dispatch(loginSuccess({
                email: response.email,
                token: response.token,
                role: userRole
            }));

            // SEPET BİRLEŞTİRME (Merge)
            try {
                await dispatch(mergeLocalCart()).unwrap();
            } catch (cartError) {
                // Sepet birleşmese bile devam ediyoruz
                console.error("Sepet birleştirme hatası:", cartError);
            }

            router.push('/');
            router.refresh();

        } catch (e: any) {
            setError(e.message || t('unknownError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {t('title')}
                </h1>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t('emailPlaceholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <Input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="******"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                        {loading ? t('logginIn') : t('login')}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    {t('dontHaveAccount')} <Link href="/register" className="text-blue-600 hover:underline">{t('registerLink')}</Link>
                </p>
            </div>
        </div>
    );
}