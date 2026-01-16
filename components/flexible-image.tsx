"use client";

import Image from "next/image";
import { useState } from "react";

interface FlexibleImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

// List of known configured domains (from next.config.ts)
const CONFIGURED_DOMAINS = ["photos.zillowstatic.com", "maps.googleapis.com"];

/**
 * Flexible image component that handles images from unknown origins.
 * Uses Next.js Image for configured domains, falls back to regular img for others.
 * This allows images from any origin without needing to configure each domain.
 */
export function FlexibleImage({
  src,
  alt,
  fill,
  className,
  width,
  height,
}: FlexibleImageProps) {
  const [useFallback, setUseFallback] = useState(false);

  // Check if the domain is configured
  let isConfiguredDomain = false;
  try {
    const url = new URL(src);
    isConfiguredDomain = CONFIGURED_DOMAINS.some((domain) =>
      url.hostname.includes(domain)
    );
  } catch {
    // Invalid URL, use fallback
    isConfiguredDomain = false;
  }

  // If domain is not configured, use regular img tag (works for any origin)
  if (!isConfiguredDomain || useFallback) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  // Use Next.js Image for configured domains
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setUseFallback(true)}
        unoptimized
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setUseFallback(true)}
      unoptimized
    />
  );
}
