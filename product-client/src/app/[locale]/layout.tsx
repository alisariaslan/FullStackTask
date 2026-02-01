/// Layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/navigation';
import StoreProvider from '@/components/shared/StoreProvider';
import Header from '@/components/shared/Navbar';
import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'e-ticaret.com';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Layout' });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: `%s | ${t('title')}`,
      default: t('title'),
    },
    description: t('description'),
    // Canonical URL ayarı (Varsayılan)
    alternates: {
      canonical: `${BASE_URL}/${locale}/`,
      languages: {
        'en': '/en',
        'tr': '/tr',
      },
    },
    // Open Graph (OG) Meta Etiketleri
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}`,
      siteName: t('title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: `${BASE_URL}/og-image.jpg`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} antialiased min-h-screen bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <Header />
            <div className="pt-4">
              {children}
            </div>
            <Toaster position="bottom-right" richColors />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}