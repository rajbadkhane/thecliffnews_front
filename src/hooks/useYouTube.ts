import { useState, useEffect } from 'react';

export interface YouTubeShort {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  publishedAt: string;
  channel: {
    name: string;
    avatar: string;
  };
}

// Mock data for YouTube Shorts
const mockShorts: YouTubeShort[] = [
  {
    id: '1',
    title: 'Breaking: Major Political Development',
    description: 'Latest updates on the political situation that has captured nationwide attention.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '0:45',
    views: 125000,
    publishedAt: '2024-09-28T10:00:00Z',
    channel: {
      name: 'The Cliff News',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '2',
    title: 'Technology Innovation Highlight',
    description: 'Revolutionary AI breakthrough announced by leading tech companies.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1:20',
    views: 89000,
    publishedAt: '2024-09-28T09:00:00Z',
    channel: {
      name: 'Tech Insider',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '3',
    title: 'Sports Championship Finals',
    description: 'Exciting moments from the championship finals that broke viewership records.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '1:15',
    views: 67000,
    publishedAt: '2024-09-28T08:00:00Z',
    channel: {
      name: 'Sports Central',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '4',
    title: 'Economic Market Update',
    description: 'Financial markets respond positively to new government policies.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '0:55',
    views: 45000,
    publishedAt: '2024-09-28T07:00:00Z',
    channel: {
      name: 'Market Watch',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '5',
    title: 'Health & Wellness Tips',
    description: 'Expert advice on maintaining mental and physical wellness.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '1:30',
    views: 34000,
    publishedAt: '2024-09-28T06:00:00Z',
    channel: {
      name: 'Health Today',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '6',
    title: 'Entertainment News',
    description: 'Latest updates from the entertainment industry.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '1:05',
    views: 28000,
    publishedAt: '2024-09-28T05:00:00Z',
    channel: {
      name: 'Entertainment Weekly',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '7',
    title: 'Science Discovery',
    description: 'New scientific research reveals fascinating insights.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '0:40',
    views: 19000,
    publishedAt: '2024-09-28T04:00:00Z',
    channel: {
      name: 'Science Daily',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '8',
    title: 'Travel Destination',
    description: 'Explore breathtaking destinations around the world.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1:45',
    views: 15000,
    publishedAt: '2024-09-28T03:00:00Z',
    channel: {
      name: 'Travel Guide',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '9',
    title: 'Cultural Heritage',
    description: 'Celebrating rich cultural traditions and heritage.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '1:10',
    views: 12000,
    publishedAt: '2024-09-28T02:00:00Z',
    channel: {
      name: 'Culture Connect',
      avatar: '/api/placeholder/40/40'
    }
  },
  {
    id: '10',
    title: 'Environmental Impact',
    description: 'Understanding climate change and environmental conservation.',
    thumbnail: '/api/placeholder/300/400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    duration: '1:25',
    views: 9000,
    publishedAt: '2024-09-28T01:00:00Z',
    channel: {
      name: 'Eco News',
      avatar: '/api/placeholder/40/40'
    }
  }
];

const fetchYouTubeShorts = async (options?: { limit?: number }): Promise<{ shorts: YouTubeShort[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const limit = options?.limit || mockShorts.length;
  return {
    shorts: mockShorts.slice(0, limit)
  };
};

export const useYouTubeShorts = (options?: { limit?: number }) => {
  const [data, setData] = useState<{ shorts: YouTubeShort[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchYouTubeShorts(options);
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