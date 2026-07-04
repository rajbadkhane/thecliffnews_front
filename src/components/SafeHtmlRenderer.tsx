"use client";

import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export function SafeHtmlRenderer({ html, className }: SafeHtmlRendererProps) {
  // Check if we have content to render
  if (!html || html.trim() === '') {
    return <div>No content available</div>;
  }

  // Configure DOMPurify to allow safe HTML elements and attributes
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id',
      'style',
      'data-start', 'data-end'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });


  // Simplified parse options - no custom replacement for now
  const options: HTMLReactParserOptions = {};

  // Parse the clean HTML with our custom options
  const parsedContent = parse(cleanHtml, options);


  return (
    <div className={cn(
      "prose prose-lg max-w-none text-gray-900 dark:text-gray-100",
      "[&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-lg",
      "[&_strong]:font-bold",
      "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
      "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8",
      "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6",
      "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4",
      className
    )}>
      {parsedContent}
    </div>
  );
}