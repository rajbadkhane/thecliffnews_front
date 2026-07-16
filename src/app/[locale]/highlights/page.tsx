import { Metadata } from "next";
import HighlightsClient from "./highlights-client";

export const metadata: Metadata = {
  title: "News Highlights | The Cliff News",
  description:
    "Explore visual highlights and top stories from The Cliff News. Curated collection of important news with engaging visuals.",
  openGraph: {
    title: "News Highlights - Top Stories with Visuals | The Cliff News",
    description:
      "Explore visual highlights and top stories from The Cliff News. Curated collection of important news with engaging visuals.",
    type: "website",
  },
};

async function getInitialHighlights() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://api.thecliffnews.in'}/api/highlights?page=1&limit=20`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );
    if (!res.ok) return { highlights: [], pages: 1 };
    const data = await res.json();
    
    const transformed = (data.highlights || []).map((highlight: any) => ({
      id: highlight.id,
      title: highlight.title,
      imageUrl: highlight.imageUrl,
      caption: highlight.caption,
      category: highlight.category,
      date: highlight.date || highlight.createdAt,
      allowDownload: highlight.allowDownload !== false,
      allowSharing: highlight.allowSharing !== false,
      viewCount: highlight.viewCount || 0,
      downloadCount: highlight.downloadCount || 0,
      shareCount: highlight.shareCount || 0,
    }));
    
    return {
      highlights: transformed,
      pages: data.pagination?.pages || 1
    };
  } catch (error) {
    console.error('Error fetching server highlights:', error);
    return { highlights: [], pages: 1 };
  }
}

export default async function HighlightsPage() {
  const { highlights, pages } = await getInitialHighlights();
  return <HighlightsClient initialHighlights={highlights} initialTotalPages={pages} />;
}
