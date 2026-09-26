export function parseYouTubeUrl(url: string | null | undefined): {
  embedUrl: string | null;
  watchUrl: string | null;
  videoId: string | null;
  thumbnailUrl: string | null;
} {
  if (!url || !url.trim()) {
    return { embedUrl: null, watchUrl: null, videoId: null, thumbnailUrl: null };
  }

  const clean = url.trim();

  // Match YouTube URLs (watch?v=ID, youtu.be/ID, shorts/ID, embed/ID)
  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);

  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
      videoId: id,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Match Vimeo URLs
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      watchUrl: `https://vimeo.com/${id}`,
      videoId: null,
      thumbnailUrl: null,
    };
  }

  return {
    embedUrl: clean,
    watchUrl: clean,
    videoId: null,
    thumbnailUrl: null,
  };
}
