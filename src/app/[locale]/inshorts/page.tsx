import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function InshortsPage({ params }: PageProps) {
  const { locale } = await params;
  // Redirect to quick-reads for backwards compatibility
  redirect(`/${locale}/quick-reads`);
}