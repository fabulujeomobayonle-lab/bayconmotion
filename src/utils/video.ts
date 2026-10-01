export interface ParsedVideo {
  embedUrl: string | null;
  watchUrl: string | null;
  videoId: string | null;
  thumbnailUrl: string | null;
  platform: "youtube" | "vimeo" | "loom" | "direct" | "unknown";
  isDirectVideo: boolean;
}

export function parseYouTubeUrl(url: string | null | undefined): ParsedVideo {
  if (!url || !url.trim()) {
    return {
      embedUrl: null,
      watchUrl: null,
      videoId: null,
      thumbnailUrl: null,
      platform: "unknown",
      isDirectVideo: false,
    };
  }

  const clean = url.trim();

  // Match direct video files
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean) || clean.startsWith("blob:")) {
    return {
      embedUrl: clean,
      watchUrl: clean,
      videoId: null,
      thumbnailUrl: null,
      platform: "direct",
      isDirectVideo: true,
    };
  }

  // Match YouTube URLs (watch?v=ID, youtu.be/ID, shorts/ID, embed/ID)
  const ytMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
      videoId: id,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      platform: "youtube",
      isDirectVideo: false,
    };
  }

  // Match Vimeo URLs
  const vimeoMatch = clean.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/
  );
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      watchUrl: `https://vimeo.com/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "vimeo",
      isDirectVideo: false,
    };
  }

  // Match Loom URLs
  const loomMatch = clean.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    const id = loomMatch[1];
    return {
      embedUrl: `https://www.loom.com/embed/${id}?autoplay=1`,
      watchUrl: `https://www.loom.com/share/${id}`,
      videoId: id,
      thumbnailUrl: null,
      platform: "loom",
      isDirectVideo: false,
    };
  }

  return {
    embedUrl: clean,
    watchUrl: clean,
    videoId: null,
    thumbnailUrl: null,
    platform: "unknown",
    isDirectVideo: false,
  };
}

