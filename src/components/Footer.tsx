"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);
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
              Your trusted source for the latest breaking news, politics,
              entertainment, sports, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/quick-reads`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quick Reads
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/videos`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/highlights`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Highlights
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/book-advertisement`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book Advertisement
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/subscribe`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/category/politics`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politics
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/category/entertainment`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/category/sports`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/category/business`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${currentLocale}/about`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/contact`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/privacy`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={`/${currentLocale}/terms`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} The Cliff News. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Technology Partner:{" "}
            <a
              href="https://cysmiqai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Cysmiq AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
