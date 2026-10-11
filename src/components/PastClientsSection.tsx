import { sound } from "@/components/SoundSystem";
import { type PastClient } from "@/utils/storage";
import { type ProjectData } from "@/components/VideoModal";
import { parseYouTubeUrl } from "@/utils/video";
import { Play, Users, Globe, ExternalLink, Sparkles, TrendingUp, Quote } from "lucide-react";

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

export function formatSocialDisplay(
  platform: "youtube" | "instagram" | "twitter" | "tiktok" | "website",
  value: string
): string {
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
      <svg className="h-3.5 w-3.5 fill-red-500" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg className="h-3.5 w-3.5 fill-pink-500" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (platform === "twitter") {
    return (
      <svg className="h-3 w-3 fill-foreground" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg className="h-3.5 w-3.5 fill-cyan-400" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.34 6.34 0 0 0 1.86-4.5V8.82a8.28 8.28 0 0 0 4.84 1.57V6.94a4.82 4.82 0 0 1-.93-.25z" />
      </svg>
    );
  }
  return <Globe className="h-3.5 w-3.5 text-cyan-400" />;
}

interface PastClientsSectionProps {
  clients: PastClient[];
  onSelectProject: (project: ProjectData) => void;
}

export function PastClientsSection({ clients, onSelectProject }: PastClientsSectionProps) {
  const publishedClients = clients.filter((c) => c.status === "published");

  if (publishedClients.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative">
      {/* Background Cyber Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)]">
          <Users className="h-3.5 w-3.5" />
          <span>CLIENT REPERTOIRE & PARTNERS</span>
        </div>

        <h2 className="font-impact text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-foreground">
          PAST <span className="text-primary neon-text">CLIENTS</span> & CREATORS
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
          High-performing creators, brands, and founders who trust Baycon for viral retention edits. Check out their channel handles, subscriber reach, and watch their showcase edits.
        </p>
      </div>

      {/* Grid of Past Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedClients.map((client) => {
          const yt = parseYouTubeUrl(client.embed_url || client.video_url);
          const thumb = client.thumbnail_url || yt.thumbnailUrl;

          const projectData: ProjectData = {
            id: client.id,
            title: client.video_title,
            category: client.company_or_niche || "Creator Edit",
            client: client.client_name,
            embedUrl: client.embed_url || yt.embedUrl,
            videoUrl: client.video_url,
            thumbnailUrl: thumb,
            views: client.results_highlight || "Viral Edit",
            retention: "High Retention Pacing",
            cuts: "Fast Paced",
            colorLut: "Baycon Custom Grade",
            description: client.testimonial_quote || `High-impact video edited by Baycon for ${client.client_name}.`,
            techniques: ["Kinetic Motion", "Sound Engineering", "Retention Hooks", "Color Grading"],
          };

          const socialKeys: (keyof typeof client.socials)[] = ["youtube", "instagram", "twitter", "tiktok", "website"];
          const activeSocials = socialKeys.filter((key) => client.socials && Boolean(client.socials[key]));

          return (
            <div
              key={client.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-[0_0_40px_rgba(255,26,26,0.25)] hover:-translate-y-1"
            >
              <div>
                {/* Client Profile Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    {client.avatar_url ? (
                      <img
                        src={client.avatar_url}
                        alt={client.client_name}
                        className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/50 shadow-[0_0_15px_rgba(255,26,26,0.4)] group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 border-2 border-primary/40 font-impact text-xl text-primary shadow-[0_0_15px_rgba(255,26,26,0.3)]">
                        {client.client_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black border border-primary/60 text-[9px]">
                      🔥
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {client.client_name}
                    </h3>
                    {client.company_or_niche && (
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {client.company_or_niche}
                      </p>
                    )}
                    {client.results_highlight && (
                      <div className="inline-flex items-center gap-1.5 mt-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        <span>{client.results_highlight}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Preview Card */}
                <div
                  onClick={() => {
                    sound.playClick(650);
                    onSelectProject(projectData);
                  }}
                  className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center cursor-pointer border border-border group/vid mb-4"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={client.video_title}
                      className="absolute inset-0 w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500 opacity-90 group-hover/vid:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-background to-cyan-950 group-hover/vid:scale-105 transition-transform duration-500" />
                  )}

                  <div className="absolute inset-0 bg-black/40 group-hover/vid:bg-black/20 transition-colors" />

                  {/* Play Button */}
                  <div className="relative z-10 flex h-13 w-13 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_25px_rgba(255,26,26,0.9)] group-hover/vid:scale-115 transition-transform">
                    <Play className="h-6 w-6 ml-0.5 fill-black" />
                  </div>

                  <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/85 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] font-bold text-white border border-white/20 z-10 flex items-center gap-1.5">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    <span>WATCH CLIENT EDIT</span>
                  </span>
                </div>

                {/* Video Title */}
                <h4 className="font-display text-sm font-bold text-foreground mb-2 line-clamp-1">
                  {client.video_title}
                </h4>

                {/* Testimonial / Quote */}
                {client.testimonial_quote && (
                  <div className="relative rounded-xl bg-background/50 border border-border/50 p-3 mb-4 font-sans text-xs text-muted-foreground italic leading-relaxed">
                    <Quote className="h-3.5 w-3.5 text-primary/60 inline mr-1.5 -mt-1" />
                    "{client.testimonial_quote}"
                  </div>
                )}
              </div>

              {/* Social Media Handles Row */}
              <div className="pt-3 border-t border-border/70 mt-auto">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
                  <span>Social Profiles</span>
                  <span className="text-cyan-400">Verified</span>
                </div>

                {activeSocials.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {activeSocials.map((platform) => {
                      const rawValue = client.socials[platform] || "";
                      const href = formatSocialUrl(platform, rawValue);
                      const displayHandle = formatSocialDisplay(platform, rawValue);

                      return (
                        <a
                          key={platform}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick(800);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-2.5 py-1.5 font-mono text-[11px] font-medium text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        >
                          <SocialIcon platform={platform} />
                          <span className="truncate max-w-[110px]">{displayHandle}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-muted-foreground italic">
                    Handles available upon inquiry
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
