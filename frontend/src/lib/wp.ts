// src/lib/wp.ts

// Base URL for your WP REST API
export const WP_API_BASE =
  `${window.location.origin}/wp-json/wp/v2`;

// Types
export interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  _embedded?: Record<string, any>;
  tags?: number[];
}

// Helpers
export function imageFromEmbedded(post: WpPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"];
  const first = Array.isArray(media) ? media[0] : null;

  const sizes = first?.media_details?.sizes;
  return (
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.full?.source_url ||
    first?.source_url ||
    null
  );
}

export function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}
