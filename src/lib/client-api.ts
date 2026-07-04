// Client-side API functions for components that need to fetch data on the client

interface YouTubeShort {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  duration: string;
  hashtags: string[];
  youtubeUrl: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Simple client-side fetch function
async function fetchClientAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Client API Error: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Client fetch error:', error);
    return null;
  }
}

// Client-side YouTube Shorts fetcher
export async function getYouTubeShortsClient(limit = 10) {
  return await fetchClientAPI<{ shorts: YouTubeShort[] }>(`/youtube/shorts?limit=${limit}`);
}