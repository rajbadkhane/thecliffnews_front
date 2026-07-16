export function getArticleUrl(locale: string, article: { slug: string; title: string; language?: string }): string {
  // Always return the original slug from the database
  return `/${locale}/article/${article.slug}`;
}
