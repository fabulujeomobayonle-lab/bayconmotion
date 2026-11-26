import { useState } from "react";
import { sound } from "@/components/SoundSystem";
import { type PastClient } from "@/utils/storage";
import { parseYouTubeUrl } from "@/utils/video";
import { SocialEmbed } from "@/components/SocialEmbed";
import { Users, ExternalLink, Play, Film } from "lucide-react";

export function formatSocialUrl(
  platform: "youtube" | "instagram" | "twitter" | "tiktok" | "website",
  value: string
): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanHandle = trimmed.replace(/^@/, "");
  switch (platform) {
    case "youtube":
      return `https://youtube.com/@${cleanHandle}`;
    case "instagram":
      return `https://instagram.com/${cleanHandle}`;
    case "twitter":
      return `https://x.com/${cleanHandle}`;
    case "tiktok":
      return `https://tiktok.com/@${cleanHandle}`;
    case "website":
      return `https://${cleanHandle}`;
    default:
      return trimmed;
  }
}

export function formatSocialDisplay(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname.replace(/^\//, "");
      if (pathname) return `@${pathname.replace(/^@/, "")}`;
      return url.hostname;
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function SocialIcon({ platform }: { platform: "youtube" | "instagram" | "twitter" | "tiktok" | "website" }) {
  if (platform === "youtube") {
    return (
      <svg className="h-4 w-4 fill-red-500 shrink-0" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg className="h-4 w-4 fill-pink-500 shrink-0" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (platform === "twitter") {
    return (
      <svg className="h-3.5 w-3.5 fill-foreground shrink-0" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg className="h-4 w-4 fill-cyan-400 shrink-0" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.34 6.34 0 0 0 1.86-4.5V8.82a8.28 8.28 0 0 0 4.84 1.57V6.94a4.82 4.82 0 0 1-.93-.25z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

interface PastClientsSectionProps {
  clients: PastClient[];
}

export function PastClientsSection({ clients }: PastClientsSectionProps) {
  const publishedClients = clients.filter((c) => c.status === "published");
  const [activeClientId, setActiveClientId] = useState<string | null>(
    publishedClients.length > 0 ? publishedClients[0].id : null
  );
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (publishedClients.length === 0) {
    return null;
  }

  const activeClient = publishedClients.find((c) => c.id === activeClientId) || publishedClients[0];

  const videoList = (
    activeClient?.video_urls && activeClient.video_urls.length > 0
      ? activeClient.video_urls
      : [activeClient?.video_url]
  ).filter(Boolean);

  const currentVideoUrl = videoList[activeVideoIndex] || videoList[0] || "";
  const yt = parseYouTubeUrl(currentVideoUrl);

  const socialKeys: (keyof typeof activeClient.socials)[] = ["youtube", "instagram", "twitter", "tiktok", "website"];
  const activeSocials = activeClient
    ? socialKeys.filter((key) => activeClient.socials && Boolean(activeClient.socials[key]))
    : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_25px_rgba(255,0,60,0.35)]">
          <Users className="h-3.5 w-3.5" />
          <span>CLIENT ROSTER & CASE STUDIES</span>
        </div>

        <h2 className="font-impact text-3xl sm:text-5xl uppercase tracking-tight text-foreground">
          PAST <span className="text-primary neon-text">CLIENTS</span>
        </h2>

        <p className="text-sm text-slate-300 font-sans">
          Select any client below to inspect their channel credentials and stream the YouTube productions engineered for them.
        </p>
      </div>

      {/* CLIENT NAME BUTTONS LIST */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {publishedClients.map((client) => {
          const isSelected = activeClientId === client.id;
          const count = client.video_urls && client.video_urls.length > 0 ? client.video_urls.length : 1;

          return (
            <button
              key={client.id}
              onClick={() => {
                sound.playClick(650);
                setActiveClientId(client.id);
                setActiveVideoIndex(0);
                setIsPlaying(false);
              }}
              className={`group flex items-center gap-2.5 rounded-2xl px-6 py-3.5 font-display text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-r from-primary to-red-500 text-black shadow-[0_0_30px_rgba(255,0,60,0.8)] scale-105 border border-red-300/60"
                  : "border border-white/10 bg-card/70 text-slate-300 hover:text-white hover:border-primary/60 hover:bg-card/95 hover:shadow-[0_0_20px_rgba(255,0,60,0.2)]"
              }`}
            >
              <span>{client.client_name}</span>
              {count > 1 && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? "bg-black/30 text-black" : "bg-primary/25 text-primary border border-primary/40 shadow-[0_0_8px_rgba(255,0,60,0.3)]"
                  }`}
                >
                  {count} videos
                </span>
              )}
              <Play className={`h-3.5 w-3.5 transition-transform ${isSelected ? "fill-black rotate-90" : "opacity-40 group-hover:opacity-100 group-hover:text-primary"}`} />
            </button>
          );
        })}
      </div>

      {/* ACTIVE CLIENT SHOWCASE CARD */}
      {activeClient && (
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/15 bg-card/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-6 animate-in fade-in duration-300">
          {/* CLIENT NAME & SOCIAL MEDIA HANDLES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">VERIFIED CLIENT</span>
              <h3 className="font-impact text-2xl sm:text-3xl uppercase tracking-wide text-white mt-0.5">
                {activeClient.client_name}
              </h3>
            </div>

            {/* SOCIAL MEDIA HANDLES */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 sm:text-right font-bold">
                SOCIAL MEDIA CHANNELS
              </div>
              {activeSocials.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {activeSocials.map((platform) => {
                    const rawValue = activeClient.socials[platform] || "";
                    const href = formatSocialUrl(platform, rawValue);
                    const displayHandle = formatSocialDisplay(rawValue);

                    return (
                      <a
                        key={platform}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => sound.playClick(800)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-background/90 px-3.5 py-2 font-mono text-xs font-semibold text-foreground hover:border-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,246,255,0.3)] transition-all duration-200"
                      >
                        <SocialIcon platform={platform} />
                        <span className="capitalize">{platform}:</span>
                        <span className="text-white font-bold">{displayHandle}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs font-mono text-muted-foreground italic">No social handle added</span>
              )}
            </div>
          </div>

          {/* MULTIPLE VIDEOS SELECTOR TABS (IF > 1) */}
          {videoList.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-cyan-400" />
                  <span>SELECT VIDEO TO WATCH ({videoList.length} VIDEOS)</span>
                </span>
                <span className="text-cyan-400 font-bold">Playing Video {activeVideoIndex + 1} of {videoList.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {videoList.map((url, idx) => (
                  <button
                    key={url + idx}
                    onClick={() => {
                      sound.playClick(700);
                      setActiveVideoIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                      activeVideoIndex === idx
                        ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,255,249,0.5)] scale-102"
                        : "border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground hover:border-cyan-500/50"
                    }`}
                  >
                    <Play className={`h-3 w-3 ${activeVideoIndex === idx ? "fill-black" : ""}`} />
                    <span>Video {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO PLAYER SECTION (Supports YouTube, TikTok, Instagram, Vimeo, Direct MP4, etc.) */}
          <div>
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 fill-cyan-400" />
                <span>
                  {yt.platformName.toUpperCase()} VIDEO {videoList.length > 1 ? `#${activeVideoIndex + 1}` : ""} CREATED FOR {activeClient.client_name.toUpperCase()}
                </span>
                {yt.isVertical && (
                  <span className="ml-2 rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                    9:16 VERTICAL
                  </span>
                )}
              </span>
              {currentVideoUrl && (
                <a
                  href={currentVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-cyan-400 hover:underline"
                >
                  <span>Open on {yt.platformName}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl bg-black border border-white/15 shadow-2xl group/player transition-all duration-300 ${
                yt.isVertical
                  ? "w-full max-w-[420px] aspect-[9/16] mx-auto shadow-[0_0_50px_rgba(0,246,255,0.25)]"
                  : "w-full aspect-video"
              }`}
            >
              {isPlaying ? (
                <>
                  <SocialEmbed
                    url={currentVideoUrl}
                    title={`${yt.platformName} video for ${activeClient.client_name}`}
                    autoPlay={true}
                  />
                  <button
                    onClick={() => {
                      sound.playClick(500);
                      setIsPlaying(false);
                    }}
                    title="Stop Video"
                    className="absolute top-3 right-3 z-30 flex items-center gap-1.5 rounded-lg bg-black/85 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-300 hover:text-white hover:bg-black border border-white/25 backdrop-blur-md shadow-lg transition-all"
                  >
                    <span>STOP VIDEO</span>
                    <span>✕</span>
                  </button>
                </>
              ) : yt.embedUrl || yt.watchUrl ? (
                <div
                  onClick={() => {
                    sound.playClick(800);
                    setIsPlaying(true);
                  }}
                  className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden select-none"
                >
                  {/* Thumbnail Image or Custom High-Tech Platform Poster */}
                  {yt.thumbnailUrl ? (
                    <img
                      src={yt.thumbnailUrl}
                      alt={`Video thumbnail for ${activeClient.client_name}`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/player:scale-105 opacity-85"
                    />
                  ) : yt.platform === "tiktok" ? (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#fe2c55]/25 via-black to-[#00f2fe]/25 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.18)_0,transparent_70%)]" />
                      <div className="text-center space-y-2 opacity-90">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/60 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,254,0.3)]">
                          <SocialIcon platform="tiktok" />
                        </div>
                        <div className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                          TIKTOK PRODUCTION
                        </div>
                      </div>
                    </div>
                  ) : yt.platform === "instagram" ? (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#833ab4]/30 via-[#fd1d1d]/20 to-[#fcb045]/25 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,48,108,0.2)_0,transparent_70%)]" />
                      <div className="text-center space-y-2 opacity-90">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/60 border border-pink-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(225,48,108,0.3)]">
                          <SocialIcon platform="instagram" />
                        </div>
                        <div className="font-mono text-xs font-bold text-pink-300 tracking-wider">
                          INSTAGRAM REEL
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-black to-cyan-950/80" />
                  )}

                  {/* Dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 transition-opacity group-hover/player:opacity-75" />

                  {/* Top info badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border ${yt.badgeBg}`}>
                      {yt.platformName.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-[10px] text-slate-300 border border-white/10 backdrop-blur-md">
                      {videoList.length > 1 ? `VIDEO ${activeVideoIndex + 1} OF ${videoList.length}` : "FEATURED EDIT"}
                    </span>
                  </div>

                  {/* Center Glowing Play Button */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full text-black border-2 border-white/80 transition-transform duration-300 group-hover/player:scale-115"
                      style={{
                        background:
                          yt.platform === "tiktok"
                            ? "linear-gradient(135deg, #00f2fe 0%, #fe2c55 100%)"
                            : yt.platform === "instagram"
                            ? "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
                            : "linear-gradient(135deg, #ff003c 0%, #ff3b30 50%, #ff003c 100%)",
                        boxShadow: `0 0 40px ${yt.brandColor || "#ff003c"}99`,
                      }}
                    >
                      <Play className="h-9 w-9 ml-1.5 fill-black" />
                    </div>
                    <div className="rounded-full bg-black/85 px-4 py-1.5 font-display text-xs font-black tracking-widest text-white border border-white/20 backdrop-blur-md shadow-xl group-hover/player:border-primary/80 group-hover/player:text-primary transition-all">
                      CLICK TO PLAY VIDEO
                    </div>
                  </div>

                  {/* Bottom title info */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-none">
                    <span className="truncate font-bold text-white">
                      {activeClient.client_name} Production
                    </span>
                    <span className="text-cyan-400 font-bold shrink-0">
                      PLAY ON DEMAND ▶
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-3 bg-zinc-950 p-6 text-center">
                  <Play className="h-12 w-12 text-primary animate-pulse" />
                  <a
                    href={currentVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-primary px-6 py-2.5 font-display text-xs font-bold uppercase text-black hover:bg-primary/90 transition-all"
                  >
                    Watch on {yt.platformName} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
