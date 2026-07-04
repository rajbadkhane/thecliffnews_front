import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default locale route
  // With 'as-needed' prefix, the default locale (en) can be accessed without prefix
  // But we want to be explicit about locale routing
  redirect('/en');
}