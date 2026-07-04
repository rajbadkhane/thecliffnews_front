"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

// Zodiac sign metadata (symbols and dates don't change)
const zodiacMetadata: Record<string, { symbol: string; dates: string }> = {
  aries: { symbol: '♈', dates: 'Mar 21 - Apr 19' },
  taurus: { symbol: '♉', dates: 'Apr 20 - May 20' },
  gemini: { symbol: '♊', dates: 'May 21 - Jun 20' },
  cancer: { symbol: '♋', dates: 'Jun 21 - Jul 22' },
  leo: { symbol: '♌', dates: 'Jul 23 - Aug 22' },
  virgo: { symbol: '♍', dates: 'Aug 23 - Sep 22' },
  libra: { symbol: '♎', dates: 'Sep 23 - Oct 22' },
  scorpio: { symbol: '♏', dates: 'Oct 23 - Nov 21' },
  sagittarius: { symbol: '♐', dates: 'Nov 22 - Dec 21' },
  capricorn: { symbol: '♑', dates: 'Dec 22 - Jan 19' },
  aquarius: { symbol: '♒', dates: 'Jan 20 - Feb 18' },
  pisces: { symbol: '♓', dates: 'Feb 19 - Mar 20' },
};

interface HoroscopeData {
  id: string;
  sign: string;
  date: string;
  prediction: string;
  luckyNumber: number | null;
  luckyColor: string | null;
  compatibility: string | null;
  mood: string | null;
}

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  prediction: string;
  luckNumber: number;
  luckColor: string;
  compatibility: string;
  mood: 'excellent' | 'good' | 'average' | 'challenging';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.thecliffnews.in';

const HoroscopeSection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [horoscopes, setHoroscopes] = useState<ZodiacSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  // Fetch horoscopes from API
  useEffect(() => {
    const fetchHoroscopes = async () => {
      try {
        setLoading(true);
        setError(null);

        const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
        const response = await fetch(`${API_BASE_URL}/api/horoscope?language=${language}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Transform API data to match our component interface
          const transformedData: ZodiacSign[] = result.data.map((horoscope: HoroscopeData) => {
            const metadata = zodiacMetadata[horoscope.sign] || { symbol: '⭐', dates: '' };
            return {
              id: horoscope.sign,
              name: horoscope.sign.charAt(0).toUpperCase() + horoscope.sign.slice(1),
              symbol: metadata.symbol,
              dates: metadata.dates,
              prediction: horoscope.prediction,
              luckNumber: horoscope.luckyNumber || Math.floor(Math.random() * 99) + 1,
              luckColor: horoscope.luckyColor || 'Blue',
              compatibility: horoscope.compatibility || 'Leo',
              mood: (horoscope.mood as 'excellent' | 'good' | 'average' | 'challenging') || 'good',
            };
          });

          // Sort by zodiac order
          const zodiacOrder = Object.keys(zodiacMetadata);
          transformedData.sort((a, b) => zodiacOrder.indexOf(a.id) - zodiacOrder.indexOf(b.id));

          setHoroscopes(transformedData);
        } else {
          throw new Error('Failed to fetch horoscopes');
        }
      } catch (err) {
        console.error('Error fetching horoscopes:', err);
        setError('Failed to load horoscopes. Please try again later.');
        // Use fallback data on error
        setHoroscopes(getFallbackHoroscopes());
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscopes();
  }, []);

  // Fallback horoscopes if API fails
  const getFallbackHoroscopes = (): ZodiacSign[] => {
    return Object.entries(zodiacMetadata).map(([sign, metadata]) => ({
      id: sign,
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      symbol: metadata.symbol,
      dates: metadata.dates,
      prediction: 'Today brings new opportunities for growth and success. Trust your instincts and stay positive.',
      luckNumber: Math.floor(Math.random() * 99) + 1,
      luckColor: 'Blue',
      compatibility: 'Leo',
      mood: 'good' as const,
    }));
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const displayedSigns = showAll ? horoscopes : horoscopes.slice(0, 6);

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Loading horoscopes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
            <h2 className="text-3xl font-bold text-foreground">
              Daily Horoscope
            </h2>
            <Sparkles className="h-8 w-8 text-purple-600 ml-2" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what the stars have in store for you today. Get personalized insights and guidance for your zodiac sign.
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
            {today}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {selectedSign ? (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setSelectedSign(null)}
              className="mb-6"
            >
              ← Back to All Signs
            </Button>

            <Card className="overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedSign.symbol}</div>
                    <div>
                      <CardTitle className="text-2xl">{selectedSign.name}</CardTitle>
                      <p className="text-purple-100">{selectedSign.dates}</p>
                    </div>
                  </div>
                  <Badge className={getMoodColor(selectedSign.mood)}>
                    {selectedSign.mood.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4 text-foreground">Today&apos;s Prediction</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {selectedSign.prediction}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Lucky Number</h4>
                      <div className="text-3xl font-bold text-primary">{selectedSign.luckNumber}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Lucky Color</h4>
                      <div className="text-lg font-medium text-primary">{selectedSign.luckColor}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Best Match</h4>
                      <div className="text-lg font-medium text-primary">{selectedSign.compatibility}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSigns.map((sign) => (
                <Card
                  key={sign.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-purple-200 dark:hover:border-purple-700"
                  onClick={() => setSelectedSign(sign)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform">
                          {sign.symbol}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{sign.name}</h3>
                          <p className="text-sm text-muted-foreground">{sign.dates}</p>
                        </div>
                      </div>
                      <Badge className={getMoodColor(sign.mood)}>
                        {sign.mood}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {sign.prediction}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-foreground font-medium">{sign.luckNumber}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {sign.luckColor}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!showAll && horoscopes.length > 6 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3"
                >
                  View All Zodiac Signs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HoroscopeSection;
