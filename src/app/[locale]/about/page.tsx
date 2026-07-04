import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about The Cliff News - your trusted source for breaking news and updates.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About The Cliff News</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Welcome to The Cliff News, your premier destination for breaking news,
          in-depth analysis, and comprehensive coverage of current events.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-4">
          We are committed to delivering accurate, timely, and unbiased news coverage
          across various categories including politics, business, entertainment, sports,
          technology, and more.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Breaking news updates</li>
          <li>In-depth political analysis</li>
          <li>Business and market insights</li>
          <li>Entertainment and lifestyle content</li>
          <li>Sports coverage and highlights</li>
          <li>Technology and science news</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
        <p className="mb-4">
          Our experienced team of journalists and editors work around the clock
          to bring you the most important stories from around the world.
        </p>
      </div>
    </div>
  );
}