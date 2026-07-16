import { Metadata } from 'next';
import Homepage from '@/components/Homepage';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: 'The Cliff News: Hindi & English News, Bhopal Updates',
    hi: 'द क्लिफ न्यूज़: हिंदी समाचार और भोपाल की ताज़ा ख़बरें'
  };

  const descriptions = {
    en: 'Get Hindi & English news from Bhopal, MP, and across India on The Cliff News, a premier Indian print newspaper and digital news network.',
    hi: 'द क्लिफ न्यूज़ पर पाएं हिंदी व अंग्रेजी समाचार, भोपाल, मध्य प्रदेश एवं देश-विदेश की ताज़ा ब्रेकिंग न्यूज़ और मुख्य खबरें।'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: locale,
    },
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'hi' },
  ];
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'hi'].includes(locale)) {
    notFound();
  }

  return <Homepage locale={locale} />;
}