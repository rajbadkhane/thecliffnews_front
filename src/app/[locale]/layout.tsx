import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  display: 'swap',
  adjustFontFallback: false
});

const locales = ['en', 'hi'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: {
    default: "The Cliff News - Latest Breaking News & Updates",
    template: "%s | The Cliff News",
  },
  description:
    "Stay updated with the latest breaking news, politics, entertainment, sports, and more from The Cliff News. Your trusted source for accurate and timely information.",
  keywords: [
    "news",
    "breaking news",
    "politics",
    "entertainment",
    "sports",
    "business",
    "technology",
  ],
  authors: [{ name: "The Cliff News Team" }],
  creator: "The Cliff News",
  publisher: "The Cliff News",
  metadataBase: new URL("https://cliffnews.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cliffnews.in",
    title: "The Cliff News - Latest Breaking News & Updates",
    description:
      "Stay updated with the latest breaking news, politics, entertainment, sports, and more from The Cliff News.",
    siteName: "The Cliff News",
    images: [
      {
        url: "/dark-logo.png",
        width: 1200,
        height: 630,
        alt: "The Cliff News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cliff News - Latest Breaking News & Updates",
    description:
      "Stay updated with the latest breaking news, politics, entertainment, sports, and more.",
    images: ["/dark-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}