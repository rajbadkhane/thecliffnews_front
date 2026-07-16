import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi ? 'गोपनीयता नीति' : 'Privacy Policy';
  const description = isHi
    ? 'हमारी गोपनीयता नीति के बारे में जानें और हम आपकी व्यक्तिगत जानकारी की सुरक्षा कैसे करते हैं।'
    : 'Learn about our privacy policy and how we protect your personal information.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: '/en/privacy',
        hi: '/hi/privacy',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isHi ? 'hi_IN' : 'en_US',
      url: `https://www.thecliffnews.in/${locale}/privacy`,
    },
  };
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose max-w-none">
        <p className="mb-4">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We may collect information you provide directly to us, such as when you:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Subscribe to our newsletter</li>
          <li>Create an account on our website</li>
          <li>Contact us for support</li>
          <li>Participate in surveys or contests</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Providing and improving our services</li>
          <li>Sending you news updates and newsletters</li>
          <li>Responding to your inquiries</li>
          <li>Analyzing website usage and trends</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties
          without your consent, except as described in this privacy policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your experience on our website. You can choose to disable
          cookies through your browser settings, but this may affect some functionality.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: Thecliffnewspaper@gmail.com<br />
          Phone: +91 87709 67135<br />
          Address: 374, G Sector, Ayodhya Nagar, Bhopal, Madhya Pradesh, India
        </p>
      </div>
    </div>
  );
}