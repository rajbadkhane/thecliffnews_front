"use client";

import { useEffect, useState } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.thecliffnews";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/the-cliff-news/id6746549944";

const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|facebot|whatsapp|telegrambot|twitterbot|xbot|linkedinbot|slackbot|discordbot|embedly|quora link preview|pinterest|vkshare|skypeuripreview/i;

function getStoreUrl() {
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

function isSameLoadedDocument() {
  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (!navigationEntry?.name) return true;

  try {
    const loadedUrl = new URL(navigationEntry.name);
    const currentUrl = new URL(window.location.href);

    return (
      loadedUrl.origin === currentUrl.origin &&
      loadedUrl.pathname === currentUrl.pathname &&
      loadedUrl.search === currentUrl.search
    );
  } catch {
    return true;
  }
}

function isExternalEntry() {
  if (!isSameLoadedDocument()) return false;

  if (!document.referrer) return true;

  try {
    return new URL(document.referrer).origin !== window.location.origin;
  } catch {
    return true;
  }
}

export default function ArticleStoreFallbackRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";

    if (BOT_USER_AGENT_PATTERN.test(userAgent)) return;
    if (!isExternalEntry()) return;

    const storeUrl = getStoreUrl();
    if (!storeUrl) return;

    const redirectKey = `cliff-news-store-redirect:${window.location.pathname}`;
    if (sessionStorage.getItem(redirectKey)) return;

    sessionStorage.setItem(redirectKey, "1");
    setIsRedirecting(true);

    const timeoutId = window.setTimeout(() => {
      window.location.assign(storeUrl);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background px-4 text-center">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Opening The Cliff News...
        </h2>
        <p className="mt-3 text-muted-foreground">
          Redirecting to your app store...
        </p>
      </div>
    </div>
  );
}
