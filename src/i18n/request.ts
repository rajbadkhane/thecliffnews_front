import { getRequestConfig } from 'next-intl/server';

export type Locale = 'en' | 'hi';

export const locales: Locale[] = ['en', 'hi'];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // Provide a default fallback locale
  let locale = await requestLocale;

  // Ensure we have a valid locale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});