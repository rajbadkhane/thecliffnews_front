import { Metadata } from 'next';
import EpaperClient from './epaper-client';

export const metadata: Metadata = {
  title: 'E-Paper Archive | The Cliff News',
  description: 'Browse and read digital editions of The Cliff News. Access current and archived newspapers in English and Hindi.',
  openGraph: {
    title: 'E-Paper Archive - Digital Newspapers | The Cliff News',
    description: 'Browse and read digital editions of The Cliff News. Access current and archived newspapers in English and Hindi.',
    type: 'website',
  },
};

export default function EpaperPage() {
  return <EpaperClient />;
}