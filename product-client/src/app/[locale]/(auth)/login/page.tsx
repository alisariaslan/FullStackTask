'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/features/auth/authSlice';
import { Link } from '@/navigation';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            const response = await authService.login(formData.email, formData.password);

            dispatch(loginSuccess({
                username: response.username,
                email: formData.email,
                token: response.token
            }));

            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Giriş başarısız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {t.has('loginTitle') ? t('loginTitle') : 'Giriş Yap'}
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                        <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="mail@ornek.com"
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
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Hesabın yok mu? <Link href="/register" className="text-blue-600 hover:underline">Kayıt Ol</Link>
                </p>
            </div>
        </div>
    );
}