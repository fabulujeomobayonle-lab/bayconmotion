import { sound } from "./SoundSystem";
import { X, Play, Sparkles, Film, Cpu, Layers, Activity, Volume2, ExternalLink } from "lucide-react";
import { parseYouTubeUrl } from "@/utils/video";

export interface ProjectData {
  id?: string;
  title: string;
  category: string;
  client?: string;
  views?: string;
  retention?: string;
  cuts?: string;
  colorLut?: string;
  description?: string;
  techniques?: string[];
  embedUrl?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}

export function VideoModal({
  project,
  onClose,
}: {
  project: ProjectData | null;
  onClose: () => void;
}) {
  if (!project) return null;

  const rawUrl = project.embedUrl || project.videoUrl;
  const parsed = parseYouTubeUrl(rawUrl);

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-primary/50 bg-card/95 p-6 md:p-8 shadow-[0_0_80px_rgba(255,26,26,0.3)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick(400);
            onClose();
          }}
          aria-label="Close video modal"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-primary hover:text-black transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-border/80 pb-4 pr-12">
          <span className="rounded-full bg-primary/20 px-3 py-1 font-mono text-xs font-bold text-primary border border-primary/40">
            {project.category}
          </span>
          <h2 className="font-display text-xl md:text-2xl font-black text-foreground">
            {project.title}
          </h2>
          {parsed.watchUrl && (
            <a
              href={parsed.watchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline ml-auto"
            >
              <span>Watch on original site</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Frame */}
          <div className="lg:col-span-2 relative aspect-video w-full rounded-xl border border-border bg-black overflow-hidden flex items-center justify-center">
            {parsed.isDirectVideo && (project.videoUrl || project.embedUrl) ? (
              <video
                src={project.videoUrl || project.embedUrl || ""}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
            ) : parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative text-center p-6 space-y-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-background to-cyan-950/40" />
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_30px_rgba(255,26,26,0.9)] animate-pulse">
                  <Play className="h-8 w-8 ml-1 fill-black" />
                </div>
                <div className="relative font-display text-sm font-bold text-white tracking-widest">
                  PREVIEWING {project.title.toUpperCase()}
                </div>
                {project.client && (
                  <div className="relative font-mono text-xs text-cyan-400">
                    CLIENT: {project.client} • VIEWS: {project.views || "Featured"}
                  </div>
                )}
              </div>
            )}

            {/* Subtle scanline overlay for aesthetic */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-40" />
          </div>

          {/* Edit Inspector Stats */}
          <div className="space-y-4 rounded-xl border border-border bg-background/60 p-5 font-mono text-xs">
            <h4 className="font-display text-xs font-bold text-primary tracking-widest flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>EDIT METRICS & SPECS</span>
            </h4>

            <div className="space-y-2 text-muted-foreground pt-2">
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>Viewer Retention:</span>
                <span className="text-emerald-400 font-bold">{project.retention || "87.4% Peak"}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>Cut Pacing Rate:</span>
                <span className="text-cyan-400 font-bold">{project.cuts || "0.8s Cut Rate"}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>Color LUT Profile:</span>
                <span className="text-purple-400 font-bold">{project.colorLut || "Baycon Cinema Pro"}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span>Total Reach:</span>
                <span className="text-yellow-400 font-bold">{project.views || "Featured Edit"}</span>
              </div>
            </div>

            {/* Techniques Used */}
            <div className="pt-2">
              <div className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>TECHNIQUES APPLIED</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(project.techniques && project.techniques.length > 0
                  ? project.techniques
                  : ["Dynamic Captions", "Sound FX Drops", "Color Grading", "Motion Graphics"]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-primary/10 px-2 py-1 text-[10px] text-primary border border-primary/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Action */}
        <div className="mt-6 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
            {project.description || "Custom high-retention video edit crafted by Baycon Motion Studio."}
          </p>

          <button
            onClick={() => {
              sound.playSuccess();
              onClose();
              window.location.href = "/contact";
            }}
            className="w-full sm:w-auto whitespace-nowrap rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-black shadow-[0_0_20px_rgba(255,26,26,0.6)] hover:bg-primary/90 transition-all"
          >
            REQUEST EDIT LIKE THIS →
          </button>
        </div>
      </div>
    </div>
  );
}

