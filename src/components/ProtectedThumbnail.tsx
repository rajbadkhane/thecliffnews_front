"use client";

import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProtectedThumbnailProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
  imageClassName?: string;
}

export default function ProtectedThumbnail({
  src,
  alt,
  onClick,
  className,
  imageClassName,
}: ProtectedThumbnailProps) {
  const block = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onContextMenu={block}
      className={cn(
        "group relative cursor-pointer overflow-hidden",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onDragStart={block}
        onContextMenu={block}
        style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        className={cn(
          "block w-full select-none object-cover blur-[1.5px] scale-[1.04] transition-transform duration-300 group-hover:scale-[1.07]",
          imageClassName,
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-black/70 via-black/40 to-black/20 text-white">
        <div className="rounded-full bg-white/15 p-3 backdrop-blur-sm">
          <Smartphone className="h-5 w-5" />
        </div>
        <p className="px-3 text-center text-sm font-medium drop-shadow">
          Open in app to view
        </p>
      </div>
    </div>
  );
}
