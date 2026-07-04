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
    en: 'The Cliff News - Latest Breaking News & Updates',
    hi: 'द क्लिफ न्यूज़ - ताज़ा ब्रेकिंग न्यूज़ और अपडेट'
  };

  const descriptions = {
    en: 'Stay updated with the latest breaking news, politics, entertainment, sports, and more.',
    hi: 'ताज़ा ब्रेकिंग न्यूज़, राजनीति, मनोरंजन, खेल और अन्य समाचारों के साथ अपडेट रहें।'
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