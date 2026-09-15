"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

export function CoverImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, 400px",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 ${className}`}
    >
      {showFallback ? (
        <div className="grid h-full w-full place-items-center text-slate-400 dark:text-slate-600">
          <ImageIcon className="h-8 w-8" aria-hidden />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
