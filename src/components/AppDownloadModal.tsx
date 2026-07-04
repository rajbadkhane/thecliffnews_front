"use client";

import Image from "next/image";
import { Newspaper, BookOpen, WifiOff, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/the-cliff-news-news-epaper/id6746549944";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.thecliffnews";

interface AppDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "default" | "epaper";
}

function Badges() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-90"
        aria-label="Download on the App Store"
      >
        <Image
          src="/badges/app-store-badge.svg"
          alt="Download on the App Store"
          width={160}
          height={48}
          className="h-12 w-auto"
          unoptimized
        />
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-90"
        aria-label="Get it on Google Play"
      >
        <Image
          src="/badges/google-play-badge.png"
          alt="Get it on Google Play"
          width={180}
          height={54}
          className="h-14 w-auto"
          unoptimized
        />
      </a>
    </div>
  );
}

const EPAPER_BENEFITS = [
  { icon: BookOpen, text: "Every page of every edition" },
  { icon: WifiOff, text: "Read offline, anytime" },
  { icon: Share2, text: "Zoom, share clips & save articles" },
];

export default function AppDownloadModal({
  open,
  onOpenChange,
  variant = "default",
}: AppDownloadModalProps) {
  if (variant === "epaper") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-8 text-center text-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <Newspaper className="h-7 w-7" />
            </div>
            <DialogHeader className="mt-4 text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold text-white">
                Read the full e-paper in our app
              </DialogTitle>
              <DialogDescription className="mt-1 text-white/90">
                Get every page of today&apos;s edition — plus the complete
                archive.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 pb-6 pt-4">
            <ul className="mb-6 space-y-3">
              {EPAPER_BENEFITS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Download The Cliff News app
            </p>
            <Badges />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl">View on our mobile app</DialogTitle>
          <DialogDescription>
            Download The Cliff News app to view and save Highlights and NIT
            papers.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Badges />
        </div>
      </DialogContent>
    </Dialog>
  );
}
