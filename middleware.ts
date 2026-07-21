import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/request';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.png`, `app-ads.txt`)
    // - … app-ads.txt specifically for AdMob verification
    '/((?!api|_next|_vercel|\\.well-known|app-ads\\.txt|.*\\..*).*)'
  ]
};
