import { Metadata } from 'next';
import QuickReadsClient from './quick-reads-client';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: 'Quick Reads - The Cliff News',
    hi: 'त्वरित समाचार - द क्लिफ न्यूज़'
  };

  const descriptions = {
    en: 'Stay informed with our quick reads - news in 60 words or less. Get the latest updates quickly.',
    hi: 'हमारे त्वरित समाचारों से अपडेट रहें - 60 शब्दों या उससे कम में न्यूज़। तुरंत नवीनतम अपडेट प्राप्त करें।'
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

export default async function QuickReadsPage({ params }: PageProps) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'hi'].includes(locale)) {
    notFound();
  }

  return <QuickReadsClient />;
}