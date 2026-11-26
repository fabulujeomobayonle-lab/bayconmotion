export type VideoPlatform =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "vimeo"
  | "twitter"
  | "facebook"
  | "drive"
  | "loom"
  | "streamable"
  | "direct"
  | "unknown";

export interface ParsedVideo {
  embedUrl: string | null;
  watchUrl: string | null;
  videoId: string | null;
  thumbnailUrl: string | null;
  platform: VideoPlatform;
  platformName: string;
  isDirectVideo: boolean;
  isVertical: boolean;
  brandColor: string;
  badgeBg: string;
}

export interface ParseVideoOptions {
  autoplay?: boolean;
}

/**
 * Universal video URL parser supporting YouTube, TikTok, Instagram (Reels & Posts),
 * Vimeo, X (Twitter), Facebook, Google Drive, Loom, Streamable, and Direct Video (MP4/WebM).
 */
export function parseVideoUrl(
  url: string | null | undefined,
  options?: ParseVideoOptions
): ParsedVideo {
  if (!url || !url.trim()) {
    return {
      embedUrl: null,
      watchUrl: null,
      videoId: null,
      thumbnailUrl: null,
      platform: "unknown",
      platformName: "Video",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#00F6FF",
      badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    };
  }

  const clean = url.trim();
  const autoplayParam = options?.autoplay ? "autoplay=1" : "autoplay=0";

  // 1. DIRECT VIDEO FILES (.mp4, .webm, .mov, blob:, etc.)
  if (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(clean) ||
    clean.startsWith("blob:") ||
    clean.startsWith("data:video/")
  ) {
    return {
      embedUrl: clean,
      watchUrl: clean,
      videoId: null,
      thumbnailUrl: null,
      platform: "direct",
      platformName: "Direct MP4",
      isDirectVideo: true,
      isVertical: false,
      brandColor: "#A855F7",
      badgeBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    };
  }

  // 2. TIKTOK (Full videos, mobile links, v2 embeds, or short vm.tiktok.com links)
  // Formats:
  // https://www.tiktok.com/@username/video/7234567890123456789
  // https://www.tiktok.com/v/7234567890123456789.html
  // https://m.tiktok.com/v/7234567890123456789.html
  // https://www.tiktok.com/embed/v2/7234567890123456789
  // https://vm.tiktok.com/ZMh2xXxXx/
  const tiktokIdMatch = clean.match(
    /(?:tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|embed\/v2\/|embed\/))(\d+)/i
  );
  if (tiktokIdMatch && tiktokIdMatch[1]) {
    const id = tiktokIdMatch[1];
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      watchUrl: `https://www.tiktok.com/video/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "tiktok",
      platformName: "TikTok",
      isDirectVideo: false,
      isVertical: true,
      brandColor: "#00F2FE",
      badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]",
    };
  }

  const tiktokShortMatch = clean.match(/(?:vm\.tiktok\.com|vt\.tiktok\.com)\/([\w-]+)/i);
  if (tiktokShortMatch && tiktokShortMatch[1]) {
    const code = tiktokShortMatch[1];
    return {
      embedUrl: `https://www.tiktok.com/embed/${code}`,
      watchUrl: clean,
      videoId: code,
      thumbnailUrl: null,
      platform: "tiktok",
      platformName: "TikTok",
      isDirectVideo: false,
      isVertical: true,
      brandColor: "#00F2FE",
      badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.3)]",
    };
  }

  // 3. INSTAGRAM (Reels, Posts, IGTV)
  // Formats:
  // https://www.instagram.com/reel/C8AbCdEfGhI/
  // https://www.instagram.com/reels/C8AbCdEfGhI/
  // https://www.instagram.com/p/C8AbCdEfGhI/
  // https://www.instagram.com/tv/C8AbCdEfGhI/
  // https://instagr.am/reel/C8AbCdEfGhI/
  const instaMatch = clean.match(
    /(?:instagram\.com|instagr\.am)\/(reel|reels|p|tv)\/([\w-]+)/i
  );
  if (instaMatch && instaMatch[2]) {
    const kind = instaMatch[1].toLowerCase();
    const id = instaMatch[2];
    const pathSegment = kind.startsWith("reel") ? "reel" : kind === "tv" ? "tv" : "p";
    const isReel = kind.startsWith("reel") || kind === "tv";

    return {
      embedUrl: `https://www.instagram.com/${pathSegment}/${id}/embed/`,
      watchUrl: `https://www.instagram.com/${pathSegment}/${id}/`,
      videoId: id,
      thumbnailUrl: null,
      platform: "instagram",
      platformName: isReel ? "Instagram Reel" : "Instagram",
      isDirectVideo: false,
      isVertical: true,
      brandColor: "#E1306C",
      badgeBg: "bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-[0_0_12px_rgba(225,48,108,0.3)]",
    };
  }

  // 4. YOUTUBE (watch, youtu.be, shorts, embed, live)
  // Formats:
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ
  // https://www.youtube.com/shorts/3i_Jv0rC1fQ
  // https://www.youtube.com/embed/dQw4w9WgXcQ
  // https://www.youtube.com/live/dQw4w9WgXcQ
  const ytMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    const isShorts = /\/shorts\//i.test(clean);

    // Parse start time if present (e.g. t=42 or t=1m30s)
    let startParam = "";
    const timeMatch = clean.match(/[?&]t=(\d+)/i);
    if (timeMatch && timeMatch[1]) {
      startParam = `&start=${timeMatch[1]}`;
    }

    return {
      embedUrl: `https://www.youtube.com/embed/${id}?${autoplayParam}&rel=0${startParam}`,
      watchUrl: isShorts
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`,
      videoId: id,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      platform: "youtube",
      platformName: isShorts ? "YouTube Shorts" : "YouTube",
      isDirectVideo: false,
      isVertical: isShorts,
      brandColor: "#FF0000",
      badgeBg: "bg-red-500/15 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(255,0,0,0.3)]",
    };
  }

  // 5. VIMEO
  // Formats: https://vimeo.com/123456789 or https://player.vimeo.com/video/123456789
  const vimeoMatch = clean.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)|player\.vimeo\.com\/video\/)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${id}?${autoplayParam}`,
      watchUrl: `https://vimeo.com/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "vimeo",
      platformName: "Vimeo",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#1AB7EA",
      badgeBg: "bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(26,183,234,0.3)]",
    };
  }

  // 6. X (TWITTER)
  // Formats: https://twitter.com/user/status/1234567890 or https://x.com/user/status/1234567890
  const twitterMatch = clean.match(
    /(?:twitter\.com|x\.com)\/(?:[\w.-]+)\/status(?:es)?\/(\d+)/i
  );
  if (twitterMatch && twitterMatch[1]) {
    const id = twitterMatch[1];
    return {
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
      watchUrl: clean,
      videoId: id,
      thumbnailUrl: null,
      platform: "twitter",
      platformName: "X (Twitter)",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#1DA1F2",
      badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/40",
    };
  }

  // 7. FACEBOOK
  // Formats: https://www.facebook.com/.../videos/123 or https://fb.watch/xyz
  const fbMatch = clean.match(
    /(?:facebook\.com\/(?:.+video\.php\?v=|watch\/\?v=|.+/videos\/)|fb\.watch\/)([\w.-]+)/i
  );
  if (fbMatch) {
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=0`,
      watchUrl: clean,
      videoId: fbMatch[1] || null,
      thumbnailUrl: null,
      platform: "facebook",
      platformName: "Facebook",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#1877F2",
      badgeBg: "bg-blue-600/15 text-blue-300 border-blue-600/40",
    };
  }

  // 8. GOOGLE DRIVE
  // Formats: https://drive.google.com/file/d/FILE_ID/view...
  const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (driveMatch && driveMatch[1]) {
    const id = driveMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      watchUrl: `https://drive.google.com/file/d/${id}/view`,
      videoId: id,
      thumbnailUrl: null,
      platform: "drive",
      platformName: "Google Drive",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#34A853",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    };
  }

  // 9. LOOM
  // Formats: https://www.loom.com/share/ID or /embed/ID
  const loomMatch = clean.match(/loom\.com\/(?:share|embed)\/([\w-]+)/i);
  if (loomMatch && loomMatch[1]) {
    const id = loomMatch[1];
    return {
      embedUrl: `https://www.loom.com/embed/${id}?${autoplayParam}`,
      watchUrl: `https://www.loom.com/share/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "loom",
      platformName: "Loom",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#625DF5",
      badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40",
    };
  }

  // 10. STREAMABLE
  // Formats: https://streamable.com/abcde
  const streamableMatch = clean.match(/streamable\.com\/([\w-]+)/i);
  if (streamableMatch && streamableMatch[1]) {
    const id = streamableMatch[1];
    return {
      embedUrl: `https://streamable.com/e/${id}?${autoplayParam}`,
      watchUrl: `https://streamable.com/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "streamable",
      platformName: "Streamable",
      isDirectVideo: false,
      isVertical: false,
      brandColor: "#00A4FF",
      badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
    };
  }

  // 11. GENERIC OR ALREADY EMBEDDED URL
  const isEmbedLikely =
    clean.includes("/embed") ||
    clean.includes("player.") ||
    clean.includes("preview");

  return {
    embedUrl: clean,
    watchUrl: clean,
    videoId: null,
    thumbnailUrl: null,
    platform: "unknown",
    platformName: isEmbedLikely ? "Embedded Video" : "Video Link",
    isDirectVideo: false,
    isVertical: false,
    brandColor: "#00F6FF",
    badgeBg: "bg-primary/15 text-primary border-primary/40",
  };
}

/**
 * Backward compatibility alias for parseVideoUrl.
 */
export const parseYouTubeUrl = parseVideoUrl;
