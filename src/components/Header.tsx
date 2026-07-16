"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Menu, X, Moon, Sun, ChevronDown, Home, FileText, ImageIcon, Newspaper, Tag, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { articlesApi } from "@/services/articles";
import type { Article } from "@/services/articles";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { getArticleUrl } from "@/lib/slug";

// Navigation item interface
interface NavigationItem {
  href: string;
  label: string;
  key: string;
  onClick?: () => void;
}

// Mock categories - in real app, fetch from API
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileDownloadOpen, setMobileDownloadOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDownloadMouseEnter = () => {
    if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
    setDownloadOpen(true);
  };

  const handleDownloadMouseLeave = () => {
    downloadTimeoutRef.current = setTimeout(() => {
      setDownloadOpen(false);
    }, 150); // 150ms buffer to prevent lag/accidental closures
  };

  const handleCategoriesMouseEnter = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    setCategoriesOpen(true);
  };

  const handleCategoriesMouseLeave = () => {
    categoriesTimeoutRef.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 150); // 150ms buffer to prevent lag/accidental closures
  };

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true);
    return () => {
      if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
      if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    };
  }, []);
  const pathname = usePathname();
  const currentLocale = useLocale();

  const headerT = {
    en: {
      download: "Download App",
      android: "Android App",
      ios: "iOS App",
      details: "Details & QR Code"
    },
    hi: {
      download: "ऐप डाउनलोड करें",
      android: "एंड्रॉइड ऐप",
      ios: "आईओएस ऐप",
      details: "विवरण और क्यूआर कोड"
    }
  }[currentLocale as 'en' | 'hi'] || {
    download: "Download App",
    android: "Android App",
    ios: "iOS App",
    details: "Details & QR Code"
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await articlesApi.getArticles({ search: searchQuery.trim(), limit: 5 });
        const articles = (response as any).articles || response.data || [];
        setSearchResults(articles);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the debounced effect above
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const SearchDropdown = () => {
    if (!showSearchDropdown) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-[100] max-h-96 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="py-2">
            {searchResults.map((article) => (
              <Link
                key={article.id}
                href={getArticleUrl(currentLocale, article)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors"
                onClick={clearSearch}
              >
                {article.featuredImage && (
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {article.category && (
                      <span className="text-xs text-primary font-medium">{article.category.name}</span>
                    )}
                    {article.publishedAt && (
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(article.publishedAt)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : searchQuery.trim().length >= 2 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No results found for &ldquo;{searchQuery}&rdquo;
          </div>
        ) : null}
      </div>
    );
  };

  const navigationItems: NavigationItem[] = [
    { href: `/${currentLocale}`, label: 'Home', key: 'home' },
    { href: `/${currentLocale}/quick-reads`, label: 'Quick Reads', key: 'quickReads' },
    { href: `/${currentLocale}/videos`, label: 'Bytes', key: 'bytes' },
    { href: `/${currentLocale}/highlights`, label: 'Highlights', key: 'highlights' },
    { href: `/${currentLocale}/nit`, label: 'NIT', key: 'nit' },
    { href: `/${currentLocale}/epaper`, label: 'E-Paper', key: 'epaper' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-background border-b transition-all duration-300",
      isScrolled ? "shadow-md border-border" : "border-border"
    )}>
      {/* Breaking News Ticker - Brand Orange background only */}
      <div className="bg-primary text-white overflow-hidden" style={{ backgroundColor: 'hsl(39 100% 50%)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center py-2">
            <span className="font-bold text-sm mr-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              BREAKING
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="custom-ticker whitespace-nowrap text-sm">
                Revolutionary climate technology breakthrough announced •
                Championship finals draw record 150M+ viewers •
                Global markets surge following policy changes •
                New discovery in quantum computing promises faster processors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center flex-shrink-0">
            <div className="relative h-8 md:h-10 lg:h-12">
              <Image
                src={mounted && theme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                alt="The Cliff News"
                width={180}
                height={50}
                className="h-full w-auto object-contain"
                style={{ maxHeight: '100%' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6 flex-1 justify-center max-w-4xl mx-6">
            <Link
              href={`/${currentLocale}`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Home
            </Link>

            {/* Categories Hover Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={handleCategoriesMouseEnter}
              onMouseLeave={handleCategoriesMouseLeave}
            >
              <Button
                variant="ghost"
                className="font-medium text-foreground hover:text-primary flex items-center space-x-1 px-2 py-1 h-auto"
              >
                <span className="text-sm">Categories</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", categoriesOpen ? "transform rotate-180" : "")} />
              </Button>

              {categoriesOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-56 bg-popover border border-border shadow-md rounded-md p-2 z-[100] grid grid-cols-2 gap-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={handleCategoriesMouseEnter}
                  onMouseLeave={handleCategoriesMouseLeave}
                >
                  {mockCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${currentLocale}/category/${category.slug}`}
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${currentLocale}/quick-reads`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/quick-reads`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Quick Reads
            </Link>

            <Link
              href={`/${currentLocale}/videos`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/videos`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Bytes
            </Link>

            <Link
              href={`/${currentLocale}/highlights`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/highlights`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Highlights
            </Link>

            <Link
              href={`/${currentLocale}/nit`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/nit`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              NIT
            </Link>

            <Link
              href={`/${currentLocale}/epaper`}
              className={cn(
                "font-medium transition-colors text-sm lg:text-base whitespace-nowrap",
                pathname === `/${currentLocale}/epaper`
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              E-Paper
            </Link>

            {/* App Download Hover Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={handleDownloadMouseEnter}
              onMouseLeave={handleDownloadMouseLeave}
            >
              <Button
                variant="ghost"
                className="font-medium text-foreground hover:text-primary flex items-center space-x-1 px-2 py-1 h-auto"
              >
                <span className="text-sm">{headerT.download}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", downloadOpen ? "transform rotate-180" : "")} />
              </Button>

              {downloadOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-44 bg-popover border border-border shadow-md rounded-md p-1 z-[100] flex flex-col transition-all duration-200 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={handleDownloadMouseEnter}
                  onMouseLeave={handleDownloadMouseLeave}
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=com.thecliffnews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  >
                    {headerT.android}
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/the-cliff-news/id6746549944"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  >
                    {headerT.ios}
                  </a>
                  <Link
                    href={`/${currentLocale}/download`}
                    className="flex items-center px-3 py-2 text-xs font-semibold text-primary hover:bg-muted rounded-md transition-colors border-t border-border/50 mt-1 pt-1"
                  >
                    {headerT.details}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 px-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">{currentLocale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/en" className="cursor-pointer">
                    English
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hi" className="cursor-pointer">
                    हिंदी
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle - visible on all screen sizes */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Desktop Search */}
            <div ref={searchRef} className="hidden lg:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    className="pl-10 w-32 xl:w-44 h-9 bg-background border-border focus:border-primary focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </form>
              <SearchDropdown />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Side Drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="w-[320px] sm:w-[380px] p-0 bg-background border-r border-border"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border bg-background">
            <SheetTitle className="flex items-center justify-between text-foreground">
              <div className="relative h-10">
                <Image
                  src={mounted && theme === 'dark' ? "/dark-logo.png" : "/light-logo.png"}
                  alt="The Cliff News"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                  style={{ maxHeight: '100%' }}
                />
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full bg-background">
            {/* Mobile Search */}
            <div ref={mobileSearchRef} className="p-4 border-b border-border bg-background relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    className="pl-10 w-full bg-background border-border focus:border-primary focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </form>
              <SearchDropdown />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto bg-background">
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile Collapsible Download App Accordion */}
                <div className="border-t border-border/50 pt-2 mt-2">
                  <button
                    onClick={() => setMobileDownloadOpen(!mobileDownloadOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors text-left"
                  >
                    <span>{headerT.download}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileDownloadOpen ? "transform rotate-180" : "")} />
                  </button>
                  {mobileDownloadOpen && (
                    <div className="pl-6 pr-4 py-2 space-y-2 bg-muted/20 rounded-lg mt-1">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.thecliffnews"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {headerT.android}
                      </a>
                      <a
                        href="https://apps.apple.com/us/app/the-cliff-news/id6746549944"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {headerT.ios}
                      </a>
                      <Link
                        href={`/${currentLocale}/download`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors border-t border-border/50 pt-2.5 mt-1"
                      >
                        {headerT.details}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories Section */}
              <div className="p-4 border-t border-border bg-background">
                <h3 className="font-semibold text-foreground mb-3 px-4 text-sm uppercase tracking-wide">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${currentLocale}/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-primary/20"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground font-semibold">
                    Appearance
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({mounted && theme === 'dark' ? 'Dark' : 'Light'})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 border-border hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {mounted && theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .custom-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
