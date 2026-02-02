// Login.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/features/auth/authSlice';
import { mergeLocalCart } from '@/lib/store/features/cart/cartSlice';
import { Link } from '@/navigation';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { jwtDecode } from "jwt-decode";
import Head from 'next/head';

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

            try {
                await dispatch(mergeLocalCart()).unwrap();
            } catch (cartError) {
                if (process.env.NEXT_PUBLIC_SILENT_CART_MERGE_ERRORS !== '1') {
                    console.error('Cart merge error:', cartError);
                }
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
        <>
            <Head>
                <title>{t('metaTitle')}</title>
                <meta name="description" content={t('metaDescription')} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">

                <div className="w-full max-w-md bg-background p-8 rounded-lg shadow-md border border-border">
                    <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
                        {t('title')}
                    </h1>

                    {error && <ErrorMessage message={error} />}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">E-Posta</label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t('emailPlaceholder')}

                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Şifre</label>
                            <Input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="******"
                            />
                        </div>


                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                            {loading ? t('logginIn') : t('login')}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-foreground/70">
                        {t('dontHaveAccount')} <Link href="/register" className="text-primary hover:underline font-medium">{t('registerLink')}</Link>
                    </p>
                </div>
            </div>
        </>
    );
}