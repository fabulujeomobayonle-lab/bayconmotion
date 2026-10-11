import { useState } from "react";
import { sound } from "@/components/SoundSystem";
import { type PastClient } from "@/utils/storage";
import { parseYouTubeUrl } from "@/utils/video";
import { Users, ExternalLink, ChevronDown, ChevronUp, Play, Sparkles } from "lucide-react";

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

  if (publishedClients.length === 0) {
    return null;
  }

  const activeClient = publishedClients.find((c) => c.id === activeClientId) || publishedClients[0];
  const yt = parseYouTubeUrl(activeClient?.embed_url || activeClient?.video_url);

  const socialKeys: (keyof typeof activeClient.socials)[] = ["youtube", "instagram", "twitter", "tiktok", "website"];
  const activeSocials = activeClient
    ? socialKeys.filter((key) => activeClient.socials && Boolean(activeClient.socials[key]))
    : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)]">
          <Users className="h-3.5 w-3.5" />
          <span>PAST CLIENTS</span>
        </div>

        <h2 className="font-impact text-3xl sm:text-5xl uppercase tracking-tight text-foreground">
          PAST <span className="text-primary neon-text">CLIENTS</span>
        </h2>

        <p className="text-sm text-muted-foreground font-sans">
          Click any client below to view their social media handles and watch the YouTube video created for them.
        </p>
      </div>

      {/* CLIENT NAME BUTTONS LIST */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {publishedClients.map((client) => {
          const isSelected = activeClientId === client.id;
          return (
            <button
              key={client.id}
              onClick={() => {
                sound.playClick(650);
                setActiveClientId(client.id);
              }}
              className={`group flex items-center gap-2 rounded-2xl px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-black shadow-[0_0_25px_rgba(255,26,26,0.6)] scale-105"
                  : "border border-border/80 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card/90"
              }`}
            >
              <span>{client.client_name}</span>
              <Play className={`h-3.5 w-3.5 transition-transform ${isSelected ? "fill-black rotate-90" : "opacity-40 group-hover:opacity-100"}`} />
            </button>
          );
        })}
      </div>

      {/* ACTIVE CLIENT SHOWCASE CARD */}
      {activeClient && (
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in duration-300">
          {/* CLIENT NAME & SOCIAL MEDIA HANDLES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">CLIENT NAME</span>
              <h3 className="font-impact text-2xl sm:text-3xl uppercase tracking-wide text-foreground mt-0.5">
                {activeClient.client_name}
              </h3>
            </div>

            {/* SOCIAL MEDIA HANDLES */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 sm:text-right">
                SOCIAL MEDIA HANDLES
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
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3.5 py-2 font-mono text-xs font-semibold text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      >
                        <SocialIcon platform={platform} />
                        <span className="capitalize">{platform}:</span>
                        <span className="text-primary font-bold">{displayHandle}</span>
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

          {/* YOUTUBE VIDEO SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 fill-cyan-400" />
                <span>YOUTUBE VIDEO CREATED FOR {activeClient.client_name.toUpperCase()}</span>
              </span>
              <a
                href={activeClient.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-cyan-400 hover:underline"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-border shadow-2xl">
              {yt.embedUrl ? (
                <iframe
                  src={yt.embedUrl}
                  title={`Video for ${activeClient.client_name}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-3 bg-zinc-950 p-6 text-center">
                  <Play className="h-12 w-12 text-primary animate-pulse" />
                  <a
                    href={activeClient.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-primary px-6 py-2.5 font-display text-xs font-bold uppercase text-black hover:bg-primary/90 transition-all"
                  >
                    Watch YouTube Video Link →
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
