"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Volume2, VolumeX, Clock, Calendar } from 'lucide-react';
import { FeaturedImage } from '@/components/FeaturedImage';
import { useTranslations } from 'next-intl';
import { formatTimeAgo } from '@/lib/formatTimeAgo';
import { cn } from '@/lib/utils';
import { ArticleSkeleton } from '@/components/skeletons/CardSkeleton';
import { Button } from '@/components/ui/button';
import { SafeHtmlRenderer } from '@/components/SafeHtmlRenderer';
import type { Article } from '@/services/articles';
import { appendShareSource } from '@/lib/share';

interface ArticleContentProps {
  slug: string;
  locale: string;
  isFromInshorts?: boolean;
  inshortsIndex?: string;
  initialArticle?: Article;
}

export default function ArticleContent({
  slug,
  locale,
  isFromInshorts = false,
  inshortsIndex,
  initialArticle
}: ArticleContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(initialArticle || null);
  const [isLoading, setIsLoading] = useState(!initialArticle);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Skip fetching if we already have the correct initialArticle matching current parameters
    if (initialArticle && initialArticle.slug === slug) {
      const isCorrectLanguage = (locale === 'hi' && initialArticle.language === 'HINDI') ||
                               (locale === 'en' && initialArticle.language === 'ENGLISH');
      if (isCorrectLanguage) {
        setArticle(initialArticle);
        setIsLoading(false);
        return;
      }
    }

    const fetchArticle = async () => {
      try {
        const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}?language=${language}`
        );
        const data = await response.json();
        setArticle(data.article);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, locale, initialArticle]);

  const handleBack = () => {
    if (isFromInshorts) {
      // Navigate back to InShorts with specific index
      const inshortsUrl = `/${locale}/inshorts${inshortsIndex ? `?index=${inshortsIndex}` : ''}`;
      router.push(inshortsUrl);
    } else {
      router.back();
    }
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window && article) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Function to setup and speak
        const setupAndSpeak = () => {
          // Clean HTML content for speech
          const textContent = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const text = `${article.title}. ${textContent}`;

          const utterance = new SpeechSynthesisUtterance(text);

          // Use article language from API response if available
          const articleLanguage = article.language;
          const hindiRegex = /[\u0900-\u097F]/;
          const hasHindiText = hindiRegex.test(text);
          const isHindiArticle = articleLanguage === 'HINDI' || locale === 'hi' || hasHindiText;

          console.log('Speech Debug:', {
            articleLanguage,
            locale,
            hasHindiText,
            isHindiArticle,
            textSample: text.substring(0, 50) + '...'
          });

          // Get available voices
          const voices = window.speechSynthesis.getVoices();
          console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

          let selectedVoice = null;

          if (isHindiArticle) {
            // Look for Hindi voice first
            selectedVoice = voices.find(voice =>
              voice.lang === 'hi-IN' ||
              voice.lang === 'hi' ||
              voice.lang.toLowerCase().includes('hindi') ||
              voice.name.toLowerCase().includes('hindi')
            );

            if (selectedVoice) {
              console.log('Using Hindi voice:', selectedVoice.name);
            } else {
              // Fallback to Indian English for Hindi content
              selectedVoice = voices.find(voice =>
                voice.lang === 'en-IN' ||
                voice.name.toLowerCase().includes('india')
              );

              if (!selectedVoice) {
                // Last resort: use any available voice but warn user
                selectedVoice = voices[0];
                console.warn('No Hindi or Indian voice found. Hindi text may not be pronounced correctly.');
                alert('Hindi voice not available on your device. The text will be read with available voice which may not pronounce Hindi correctly.');
              }
              console.log('Using fallback voice:', selectedVoice?.name || 'none');
            }
          } else {
            // Look for English voice
            selectedVoice = voices.find(voice =>
              voice.lang === 'en-US' ||
              voice.lang === 'en-GB' ||
              voice.lang.startsWith('en')
            ) || voices[0];
            console.log('Using English voice:', selectedVoice?.name || 'default');
          }

          // Set the voice and language
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
          } else {
            // This shouldn't happen, but just in case
            utterance.lang = isHindiArticle ? 'hi-IN' : 'en-US';
          }

          console.log('Final speech config:', {
            lang: utterance.lang,
            voice: utterance.voice?.name,
            voiceLang: utterance.voice?.lang,
            rate: isHindiArticle ? 0.6 : 0.8
          });

          // Adjust speech parameters
          utterance.rate = isHindiArticle ? 0.6 : 0.8;
          utterance.pitch = 1;
          utterance.volume = 1;

          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        };

        // Get voices first
        const voices = window.speechSynthesis.getVoices();

        if (voices.length === 0) {
          // Voices not loaded yet, wait for them
          console.log('Waiting for voices to load...');
          window.speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('Voices loaded, starting speech...');
            setupAndSpeak();
          }, { once: true });

          // Trigger voice loading by calling getVoices again
          window.speechSynthesis.getVoices();
        } else {
          // Voices already loaded
          setupAndSpeak();
        }
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: appendShareSource(window.location.href)
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (utteranceRef.current && isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('common.error')}</h1>
          <p className="text-muted-foreground mb-4">Article not found</p>
          <Button onClick={handleBack}>{t('common.goBack')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFromInshorts ? t('quickReads.title') : t('common.back')}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSpeech}
                className={cn(
                  "flex items-center gap-2",
                  isSpeaking && "bg-primary/10 text-primary"
                )}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isSpeaking ? t('home.pauseReading') : t('home.listenToArticle')}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('home.shareArticle')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category & Breaking Badge */}
        <div className="flex items-center gap-3 mb-4">
          {article.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category.name}
            </span>
          )}
          {article.isBreaking && (
            <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium animate-pulse">
              {t('home.breakingNews')}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-normal mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
          {article.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
          )}

          {article.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t('article.minRead', { minutes: article.readTime })}</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <FeaturedImage
              src={article.featuredImage}
              alt={article.title}
              variant="hero"
              className="w-full rounded-2xl"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <SafeHtmlRenderer
          html={article.content}
          className="max-w-none"
        />

        {/* Tags */}
        {article.tags && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.split(',').map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
