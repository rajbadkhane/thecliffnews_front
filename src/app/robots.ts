import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended'
        ],
        allow: '/',
        disallow: '/api/',
      }
    ],
    sitemap: [
      'https://www.thecliffnews.in/sitemap.xml',
      'https://www.thecliffnews.in/news-sitemap.xml',
    ],
  };
}
