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
    en: 'The Cliff News: Hindi & English News, Bhopal & Madhya Pradesh Updates',
    hi: 'द क्लिफ न्यूज़: हिंदी और अंग्रेजी समाचार, भोपाल और मध्य प्रदेश की ताज़ा ख़बरें'
  };

  const descriptions = {
    en: 'Stay updated with The Cliff News, a premier Indian print newspaper and digital news network providing Hindi news, English news, and the latest today news updates from Bhopal, Madhya Pradesh, and across India.',
    hi: 'द क्लिफ न्यूज़ प्रिंट समाचार पत्र और डिजिटल न्यूज़ नेटवर्क पर पाएं हिंदी समाचार, अंग्रेजी समाचार, और भोपाल, मध्य प्रदेश एवं देश-विदेश की ताज़ा ब्रेकिंग न्यूज़ व मुख्य खबरें।'
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