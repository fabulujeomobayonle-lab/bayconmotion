import { useEffect, useRef, useState } from "react";
import { parseVideoUrl, type ParsedVideo } from "@/utils/video";
import { Play, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";

interface SocialEmbedProps {
  url: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

/**
 * Universal Social Video Player
 * Supports:
 * - TikTok: via official embed.js script + blockquote + direct player fallback
 * - Instagram: via official embed.js script + clean embed iframe
 * - YouTube: via official responsive iframe
 * - Vimeo, Twitter/X, Loom, Drive: via clean responsive iframes
 * - Direct MP4 / WebM / MOV: via native HTML5 video player
 */
export function SocialEmbed({ url, title, autoPlay = true, className = "" }: SocialEmbedProps) {
  const parsed: ParsedVideo = parseVideoUrl(url, { autoplay: autoPlay });
  const [loadError, setLoadError] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. TIKTOK EMBED LIFECYCLE
  useEffect(() => {
    if (parsed.platform !== "tiktok") return;

    setLoadError(false);
    const scriptId = "tiktok-embed-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Re-trigger TikTok embed scan for newly mounted component
      try {
        if ((window as any).tiktok?.embed?.process) {
          (window as any).tiktok.embed.process();
        }
      } catch {}
    }
  }, [url, parsed.platform]);

  // 2. INSTAGRAM EMBED LIFECYCLE
  useEffect(() => {
    if (parsed.platform !== "instagram") return;

    const scriptId = "instagram-embed-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      try {
        if ((window as any).instgrm?.Embeds?.process) {
          (window as any).instgrm.Embeds.process();
        }
      } catch {}
    }
  }, [url, parsed.platform]);

  // DIRECT VIDEO PLAYER (MP4, WebM, MOV, blob:)
  if (parsed.isDirectVideo && (parsed.embedUrl || url)) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-black ${className}`}>
        <video
          key={url}
          src={parsed.embedUrl || url}
          controls
          autoPlay={autoPlay}
          playsInline
          className="w-full h-full object-contain bg-black"
        />
      </div>
    );
  }

  // TIKTOK PLAYER (Handles official embed.js widget + iframe + direct fallbacks)
  if (parsed.platform === "tiktok") {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full bg-black flex flex-col items-center justify-center overflow-y-auto p-2 ${className}`}
      >
        {/* If user requested direct iframe or fallback */}
        {useIframeFallback && parsed.videoId ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <iframe
              key={`tt-iframe-${url}`}
              src={`https://www.tiktok.com/player/v1/${parsed.videoId}?embed_from=oembed&music_info=1&description=1&autoplay=1`}
              title={title || "TikTok video player"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="lazy"
              onError={() => setLoadError(true)}
            />
          </div>
        ) : (
          /* Official TikTok blockquote transformed by https://www.tiktok.com/embed.js */
          <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto py-2">
            <blockquote
              className="tiktok-embed"
              cite={url}
              data-video-id={parsed.videoId || ""}
              style={{
                maxWidth: "380px",
                minWidth: "280px",
                width: "100%",
                margin: "0 auto",
                background: "transparent",
              }}
            >
              <section className="text-center p-6 space-y-4">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.4)] animate-pulse">
                  <Play className="h-7 w-7 fill-cyan-400" />
                </div>
                <div className="space-y-1">
                  <div className="font-display text-sm font-bold text-white tracking-wide">
                    CONNECTING TIKTOK PLAYER...
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Loading video from TikTok servers.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-500 px-5 py-2 font-display text-xs font-black uppercase text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,254,0.5)]"
                  >
                    <span>Watch Directly on TikTok</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </section>
            </blockquote>
          </div>
        )}

        {/* Top/Bottom Floating Control Pill to ensure video is ALWAYS accessible */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[10px] font-mono shadow-lg">
          <button
            onClick={() => setUseIframeFallback((prev) => !prev)}
            className="text-cyan-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Switch Player Mode"
          >
            <RefreshCw className="h-3 w-3" />
            <span>{useIframeFallback ? "Widget Mode" : "Player Mode"}</span>
          </button>
          <span className="text-white/20">|</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-pink-400 hover:text-white flex items-center gap-1 font-bold"
          >
            <span>Open in App</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    );
  }

  // INSTAGRAM PLAYER
  if (parsed.platform === "instagram") {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        {parsed.embedUrl ? (
          <iframe
            key={url}
            src={parsed.embedUrl}
            title={title || "Instagram reel player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-6 space-y-3">
            <p className="text-xs text-slate-300 font-mono">Opening Instagram reel...</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2 font-display text-xs font-bold text-white hover:bg-pink-600 transition-all"
            >
              <span>Watch on Instagram</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <div className="absolute bottom-2 right-2 z-20">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-black/85 px-2.5 py-1 text-[10px] font-mono text-pink-300 hover:text-white border border-pink-500/30 backdrop-blur-md"
          >
            <span>Open in Instagram ↗</span>
          </a>
        </div>
      </div>
    );
  }

  // YOUTUBE & STANDARD IFRAME EMBEDS (YouTube, Vimeo, Twitter, Loom, Drive, etc.)
  if (parsed.embedUrl) {
    const embedSrc =
      parsed.platform === "youtube"
        ? parsed.embedUrl.includes("?")
          ? `${parsed.embedUrl}&autoplay=${autoPlay ? "1" : "0"}`
          : `${parsed.embedUrl}?autoplay=${autoPlay ? "1" : "0"}`
        : parsed.embedUrl;

    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        <iframe
          key={url}
          src={embedSrc}
          title={title || `${parsed.platformName} video player`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // UNKNOWN OR BLOCKED FALLBACK
  return (
    <div className={`flex flex-col items-center justify-center bg-zinc-950 p-6 text-center space-y-4 ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(255,0,60,0.5)]">
        <Play className="h-7 w-7 fill-primary" />
      </div>
      <div className="space-y-1">
        <div className="font-display text-sm font-bold text-white tracking-wide">
          WATCH ON {parsed.platformName.toUpperCase()}
        </div>
        <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
          This platform restricts direct third-party framing. Click below to stream the video in full resolution!
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-display text-xs font-bold uppercase text-black hover:bg-primary/90 transition-all shadow-[0_0_25px_rgba(255,0,60,0.6)]"
      >
        <span>Open Video on {parsed.platformName}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
