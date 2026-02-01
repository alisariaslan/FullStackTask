// Register.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { authService } from '@/services/authService';
import { Link } from '@/navigation';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Head from 'next/head';

export default function RegisterPage() {
    const t = useTranslations('Register');
    const router = useRouter();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.register(formData.email, formData.password);
            router.push('/login');
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
                            {loading ? t('saving') : t('register')}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-foreground/70">
                        {t('haveAccount')} <Link href="/login" className="text-primary hover:underline font-medium">{t('loginLink')}</Link>
                    </p>
                </div>
            </div>
        </>
    );
}