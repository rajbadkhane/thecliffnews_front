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

export default function HighlightsPage() {
  return <HighlightsClient />;
}
