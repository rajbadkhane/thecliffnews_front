"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react";

const mockCategories = [
  { id: '1', name: 'National', slug: 'national' },
  { id: '2', name: 'Politics', slug: 'politics' },
  { id: '3', name: 'Business', slug: 'business' },
  { id: '4', name: 'Sports', slug: 'sports' },
  { id: '5', name: 'Entertainment', slug: 'entertainment' },
  { id: '6', name: 'Technology', slug: 'technology' },
  { id: '7', name: 'Science', slug: 'science' },
  { id: '8', name: 'Health', slug: 'health' },
];

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const footerT = {
    en: {
      brandDesc: "Your trusted source for the latest today news, live breaking updates, politics, sports, and more from Bhopal, Madhya Pradesh, and India.",
      quickLinks: "Quick Links",
      home: "English News Portal Home",
      quickReads: "Quick Reads & Shorts",
      videos: "Videos & News Bytes",
      highlights: "Highlights",
      bookAdv: "Book Advertisement",
      subscribe: "Subscribe",
      categoriesTitle: "Categories",
      contactTitle: "Contact Us",
      aboutUs: "About The Cliff News (Bhopal Press)",
      contact: "Contact Bhopal Office",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      allRightsReserved: "All rights reserved."
    },
    hi: {
      brandDesc: "द क्लिफ न्यूज़ पर पाएं हिंदी समाचार, अंग्रेजी समाचार, भोपाल और मध्य प्रदेश की ताज़ा ब्रेकिंग न्यूज़ व आज के मुख्य समाचार।",
      quickLinks: "त्वरित लिंक",
      home: "हिंदी समाचार पोर्टल होम",
      quickReads: "त्वरित पठन (Quick Reads)",
      videos: "वीडियो न्यूज़ बाइट्स",
      highlights: "मुख्य समाचार हाइलाइट्स",
      bookAdv: "विज्ञापन बुक करें",
      subscribe: "सदस्यता लें (Subscribe)",
      categoriesTitle: "समाचार श्रेणियां",
      contactTitle: "संपर्क करें",
      aboutUs: "द क्लिफ न्यूज़ के बारे में (भोपाल प्रिंटिंग प्रेस)",
      contact: "भोपाल कार्यालय से संपर्क करें",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      allRightsReserved: "सर्वाधिकार सुरक्षित।"
    }
  }[currentLocale as 'en' | 'hi'] || {
    brandDesc: "Your trusted source for the latest today news, live breaking updates, politics, sports, and more from Bhopal, Madhya Pradesh, and India.",
    quickLinks: "Quick Links",
    home: "English News Portal Home",
    quickReads: "Quick Reads & Shorts",
    videos: "Videos & News Bytes",
    highlights: "Highlights",
    bookAdv: "Book Advertisement",
    subscribe: "Subscribe",
    categoriesTitle: "Categories",
    contactTitle: "Contact Us",
    aboutUs: "About The Cliff News (Bhopal Press)",
    contact: "Contact Bhopal Office",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    allRightsReserved: "All rights reserved."
  };

  const categoryNames: Record<string, Record<string, string>> = {
    national: { en: 'National News', hi: 'राष्ट्रीय समाचार' },
    politics: { en: 'Politics & Governance', hi: 'राजनीति समाचार' },
    business: { en: 'Business & Economy', hi: 'व्यापार समाचार' },
    sports: { en: 'Sports News', hi: 'खेल समाचार' },
    entertainment: { en: 'Entertainment News', hi: 'मनोरंजन समाचार' },
    technology: { en: 'Technology Trends', hi: 'तकनीकी समाचार' },
    science: { en: 'Science News', hi: 'विज्ञान समाचार' },
    health: { en: 'Health & Wellness', hi: 'स्वास्थ्य और चिकित्सा' }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={`/${currentLocale}`} className="flex items-center">
              <div className="relative h-8 md:h-10">
                <Image
                  src={mounted && theme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                  alt="The Cliff News"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                  style={{ maxHeight: '100%' }}
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm">
              {footerT.brandDesc}
            </p>
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/thecliffnews/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#1877F2]/10 text-[#1877F2] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/the_cliff_news/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#E4405F]/10 text-[#E4405F] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/thecliffnews"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#0A66C2]/10 text-[#0A66C2] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@thecliffnews"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#FF0000]/10 text-[#FF0000] transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://hi.wikipedia.org/wiki/%E0%A4%B8%E0%A4%B8%E0%A5%8D%E0%A4%B5_%E0%A4%B5%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%BE:THE_CLIFF_NEWS"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#515254]/10 text-[#515254] dark:text-[#CCCCCC] transition-all duration-300 flex items-center justify-center"
                aria-label="Wikipedia"
              >
                {/* Wikipedia Stylized W Icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M2 4h4l3 12 3-12h4l3 12 3-12h4" />
                </svg>
              </a>
              <a
                href="https://share.google/SIuMRdVkhJGP2sGnh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-[#4285F4]/10 transition-all duration-300 flex items-center justify-center"
                aria-label="Google Profile"
              >
                {/* Google Multi-Color Official Icon */}
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{footerT.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${currentLocale}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/quick-reads`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.quickReads}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/videos`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.videos}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/highlights`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.highlights}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/book-advertisement`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.bookAdv}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/subscribe`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.subscribe}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{footerT.categoriesTitle}</h3>
            <ul className="space-y-2 text-sm">
              {mockCategories.map((category) => {
                const localizedName = categoryNames[category.slug]?.[currentLocale] || category.name;
                return (
                  <li key={category.id}>
                    <Link
                      href={`/${currentLocale}/category/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {localizedName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{footerT.contactTitle}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${currentLocale}/about`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/privacy`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/terms`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {footerT.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} The Cliff News. {footerT.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
