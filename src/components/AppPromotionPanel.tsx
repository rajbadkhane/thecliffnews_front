"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Smartphone, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.thecliffnews";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/the-cliff-news/id6746549944";
const BANNER_IMAGE_SRC = "/promotional-banner.jpeg";
const CHROME_ICON_SRC =
  "https://www.google.com/chrome/static/images/chrome-logo.svg";
const DISMISS_KEY = "the-cliff-news:article-app-promo-dismissed";

const COPY = {
  en: {
    heading: "For a better news experience...",
    appLabel: "Better news experience",
    download: "Download App",
    browserLabel: "Stay in browser",
    browser: "Continue on Browser",
    close: "Dismiss app promotion",
  },
  hi: {
    heading: "द क्लिफ न्यूज़ पढ़ने के लिए...",
    appLabel: "बेहतर न्यूज़ अनुभव",
    download: "डाउनलोड ऐप",
    browserLabel: "ब्राउज़र में ही",
    browser: "ब्राउज़र पर पढ़ें",
    close: "ऐप प्रचार बंद करें",
  },
};

function getMobileStoreUrl() {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isAndroid = /android/i.test(userAgent);
  const isIOS =
    /iphone|ipad|ipod/i.test(userAgent) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isAndroid) return PLAY_STORE_URL;
  if (isIOS) return APP_STORE_URL;
  return null;
}

function getLocaleFromPath(pathname: string) {
  if (pathname.startsWith("/hi")) return "hi";
  return "en";
}

function isSupportedPublicRoute(pathname: string) {
  if (!/^\/(?:en|hi)(?:\/|$)/.test(pathname)) return false;
  return !/(?:^|\/)(?:admin|cms|dashboard|login|auth)(?:\/|$)/i.test(pathname);
}

export default function AppPromotionPanel() {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const locale = getLocaleFromPath(pathname);
  const copy = locale === "hi" ? COPY.hi : COPY.en;
  const isPreviewMode = searchParams.get("appPromoPreview") === "1";
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSupportedRoute = useMemo(
    () => isSupportedPublicRoute(pathname),
    [pathname]
  );
  const [isDismissed, setIsDismissed] = useState(true);
  const [isTriggered, setIsTriggered] = useState(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const appOpenedRef = useRef(false);

  useEffect(() => {
    setIsDismissed(
      !isPreviewMode && sessionStorage.getItem(DISMISS_KEY) === "1"
    );
  }, [isPreviewMode, pathname]);

  useEffect(() => {
    setIsTriggered(false);

    const triggerFromScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? scrollTop / scrollable : 0;

      if (progress >= 0.15) {
        setIsTriggered(true);
      }
    };

    const timerId = window.setTimeout(() => setIsTriggered(true), 2500);

    triggerFromScroll();
    window.addEventListener("scroll", triggerFromScroll, { passive: true });

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("scroll", triggerFromScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const markAppOpened = () => {
      appOpenedRef.current = true;
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", markAppOpened);
    window.addEventListener("pagehide", markAppOpened);
    window.addEventListener("blur", markAppOpened);

    return () => {
      document.removeEventListener("visibilitychange", markAppOpened);
      window.removeEventListener("pagehide", markAppOpened);
      window.removeEventListener("blur", markAppOpened);
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const isVisible =
    isSupportedRoute && !isDismissed && isTriggered;

  useEffect(() => {
    if (!isDevelopment) return;

    let reason = "currently visible";
    if (!isSupportedRoute) reason = "unsupported route";
    else if (isDismissed) reason = "session dismissal";
    else if (!isTriggered) reason = "not yet triggered";

    console.info(`[AppPromotionPanel] ${reason}`);
  }, [
    isDevelopment,
    isSupportedRoute,
    isDismissed,
    isTriggered,
  ]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setIsDismissed(true);
  };

  const handleDownload = () => {
    const storeUrl = getMobileStoreUrl();

    if (!storeUrl) {
      window.open(`/${locale}/download`, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = storeUrl;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <aside
        aria-label="The Cliff News app promotion"
        className="fixed inset-x-0 bottom-3 z-[70] px-3 motion-safe:animate-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-300"
      >
        <div className="relative mx-auto max-w-[500px] overflow-hidden rounded-3xl border border-orange-300/70 bg-white/82 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 text-neutral-950 shadow-[0_18px_60px_rgba(92,45,0,0.22),0_0_24px_rgba(249,115,22,0.2)] backdrop-blur-md">
          <button
            type="button"
            aria-label={copy.close}
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="-mx-3 -mt-3 overflow-hidden rounded-t-3xl border-b border-orange-300/70 bg-white/90">
            <Image
              src={BANNER_IMAGE_SRC}
              alt="The Cliff News app"
              width={1600}
              height={533}
              className="h-20 w-full object-contain sm:h-24"
              priority={false}
            />
          </div>

          <h2 className="px-1 pb-2 pt-2.5 text-[15px] font-semibold leading-snug text-neutral-950">
            {copy.heading}
          </h2>

          <div className="space-y-1.5">
            <div className="flex min-h-[48px] items-center gap-2.5 rounded-2xl border border-orange-200/85 bg-orange-50/90 px-2.5 py-1.5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-orange-200 bg-white text-orange-600 shadow-sm">
                <Smartphone className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight text-neutral-900">
                {copy.appLabel}
              </span>
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-9 flex-none rounded-full bg-orange-500 px-3.5 text-[13px] font-bold text-white shadow-lg shadow-orange-950/25 transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
              >
                {copy.download}
              </button>
            </div>

            <div className="flex min-h-[48px] items-center gap-2.5 rounded-2xl border border-neutral-200/90 bg-white/80 px-2.5 py-1.5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm">
                <img
                  src={CHROME_ICON_SRC}
                  alt=""
                  aria-hidden="true"
                  className="h-[20px] w-[20px]"
                />
              </span>
              <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight text-neutral-900">
                {copy.browserLabel}
              </span>
              <button
                type="button"
                onClick={dismiss}
                className="min-h-9 flex-none rounded-full bg-neutral-900 px-3.5 text-[13px] font-bold text-white transition hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                {copy.browser}
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div
        aria-hidden="true"
        className="h-[150px]"
      />
    </>
  );
}
