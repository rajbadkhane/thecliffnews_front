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

interface GenerateMetadataProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps) {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi
    ? "द क्लिफ न्यूज़: हिंदी समाचार और भोपाल की ताज़ा ख़बरें"
    : "The Cliff News: Hindi & English News, Bhopal Updates";

  const description = isHi
    ? "द क्लिफ न्यूज़ पर पाएं हिंदी व अंग्रेजी समाचार, भोपाल, मध्य प्रदेश एवं देश-विदेश की ताज़ा ब्रेकिंग न्यूज़ और मुख्य खबरें।"
    : "Get Hindi & English news from Bhopal, MP, and across India on The Cliff News, a premier Indian print newspaper and digital news network.";

  return {
    title: {
      default: title,
      template: isHi ? "%s | द क्लिफ न्यूज़" : "%s | The Cliff News",
    },
    description,
    keywords: isHi
      ? [
          "समाचार", "मुख्य समाचार", "आज की ताज़ा ख़बरें", "मध्य प्रदेश समाचार", 
          "भोपाल न्यूज़ लाइव", "ब्रेकिंग न्यूज़ लाइव", "हिंदी समाचार लाइव", 
          "आज का समाचार पत्र", "शॉर्ट न्यूज़ ऐप", "दैनिक ई-पेपर", "चुनाव समाचार", 
          "देश-विदेश के समाचार", "विश्वसनीय समाचार स्रोत"
        ]
      : [
          "news", "India news today", "latest Hindi news live", "Madhya Pradesh breaking news", 
          "Bhopal news live", "Hindi news paper today", "daily news updates", 
          "short news app", "daily ePaper PDF", "political news updates", 
          "national news portal", "Bhopal local updates", "verified news reporting"
        ],
    authors: [{ name: "The Cliff News Team" }],
    creator: "The Cliff News",
    publisher: "The Cliff News",
    metadataBase: new URL("https://www.thecliffnews.in"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        hi: "/hi",
      },
    },
    openGraph: {
      type: "website",
      locale: isHi ? "hi_IN" : "en_US",
      url: `https://www.thecliffnews.in/${locale}`,
      title,
      description,
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
      title,
      description,
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
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "your-google-verification-code",
    },
  };
}

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "The Cliff News",
    "url": "https://www.thecliffnews.in",
    "logo": "https://www.thecliffnews.in/dark-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8770967135",
      "contactType": "customer service",
      "email": "Thecliffnewspaper@gmail.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "The Cliff News",
    "url": "https://www.thecliffnews.in"
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
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