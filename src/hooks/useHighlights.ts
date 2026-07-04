import { useState, useEffect } from 'react';

export interface Highlight {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  image?: string;
  link: string;
  publishedAt: string;
  isBreaking?: boolean;
  viewCount?: number;
  shareCount?: number;
  likeCount?: number;
  category?: {
    name: string;
    color: string;
  };
}

// Mock API for highlights
const mockHighlights: Highlight[] = [
  {
    id: '1',
    title: 'Revolutionary Climate Technology Breakthrough',
    excerpt: 'Scientists announce major breakthrough in carbon capture technology',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/climate-technology-breakthrough',
    publishedAt: '2024-09-28T10:00:00Z',
    isBreaking: true,
    viewCount: 125000,
    shareCount: 2500,
    likeCount: 8900,
    category: { name: 'Science', color: 'bg-blue-500' }
  },
  {
    id: '2',
    title: 'Global Economic Summit Concludes',
    excerpt: 'World leaders reach consensus on new trade agreements',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/economic-summit-concludes',
    publishedAt: '2024-09-28T09:00:00Z',
    isBreaking: false,
    viewCount: 89000,
    shareCount: 1800,
    likeCount: 5600,
    category: { name: 'Business', color: 'bg-green-500' }
  },
  {
    id: '3',
    title: 'Sports Championship Finals',
    excerpt: 'Historic match draws record-breaking viewership',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/championship-finals',
    publishedAt: '2024-09-28T08:00:00Z',
    isBreaking: false,
    viewCount: 267000,
    shareCount: 4200,
    likeCount: 15600,
    category: { name: 'Sports', color: 'bg-orange-500' }
  },
  {
    id: '4',
    title: 'Space Exploration Milestone',
    excerpt: 'New telescope reveals stunning images of distant galaxies',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/space-exploration-milestone',
    publishedAt: '2024-09-28T07:00:00Z',
    isBreaking: false,
    viewCount: 156000,
    shareCount: 3100,
    likeCount: 12800,
    category: { name: 'Science', color: 'bg-purple-500' }
  },
  {
    id: '5',
    title: 'AI Innovation in Healthcare',
    excerpt: 'Machine learning breakthrough improves diagnostic accuracy',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/ai-innovation-healthcare',
    publishedAt: '2024-09-28T06:00:00Z',
    isBreaking: false,
    viewCount: 78000,
    shareCount: 1600,
    likeCount: 4900,
    category: { name: 'Technology', color: 'bg-indigo-500' }
  },
  {
    id: '6',
    title: 'Cultural Heritage Preservation',
    excerpt: 'UNESCO announces new initiatives to preserve ancient sites',
    featuredImage: '/api/placeholder/400/300',
    image: '/api/placeholder/400/300',
    link: '/en/article/cultural-heritage-preservation',
    publishedAt: '2024-09-28T05:00:00Z',
    isBreaking: false,
    viewCount: 45000,
    shareCount: 890,
    likeCount: 2800,
    category: { name: 'Culture', color: 'bg-pink-500' }
  }
];

const fetchHighlights = async (options?: { limit?: number }): Promise<{ highlights: Highlight[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const limit = options?.limit || mockHighlights.length;
  return {
    highlights: mockHighlights.slice(0, limit)
  };
};

export const useHighlights = (options?: { limit?: number }) => {
  const [data, setData] = useState<{ highlights: Highlight[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchHighlights(options);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [options?.limit]);

  return { data, isLoading, error };
};