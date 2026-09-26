import { sound } from "./SoundSystem";
import { X, Play, Cpu, Layers, ExternalLink } from "lucide-react";
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

  const parsed = parseYouTubeUrl(project.embedUrl || project.videoUrl);

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-primary/50 bg-card/95 p-6 md:p-8 shadow-[0_0_80px_rgba(255,26,26,0.3)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick(400);
            onClose();
          }}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-primary hover:text-black transition-all z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-border/80 pb-4 pr-10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-primary/20 px-3 py-1 font-mono text-xs font-bold text-primary border border-primary/40">
              {project.category}
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black text-foreground">
              {project.title}
            </h2>
          </div>
          {parsed.watchUrl && (
            <a
              href={parsed.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-bold text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
            >
              Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Frame */}
          <div className="lg:col-span-2 relative aspect-video w-full rounded-xl border border-border bg-black overflow-hidden flex items-center justify-center group shadow-2xl">
            {parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={project.title}
                className="w-full h-full border-0 rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : project.videoUrl ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative text-center p-6 space-y-3">
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_30px_rgba(255,26,26,0.9)] animate-pulse">
                  <Play className="h-8 w-8 ml-1 fill-black" />
                </div>
                <div className="relative z-10 font-display text-sm font-bold text-white tracking-widest">
                  {project.title.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Edit Inspector Stats */}
          <div className="space-y-4 rounded-xl border border-border bg-background/60 p-5 font-mono text-xs">
            <h4 className="font-display text-xs font-bold text-primary tracking-widest flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>EDIT METRICS & SPECS</span>
            </h4>

            <div className="space-y-2 text-muted-foreground pt-2">
              {project.retention && (
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span>Viewer Retention:</span>
                  <span className="text-emerald-400 font-bold">{project.retention}</span>
                </div>
              )}
              {project.cuts && (
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span>Cut Pacing Rate:</span>
                  <span className="text-cyan-400 font-bold">{project.cuts}</span>
                </div>
              )}
              {project.colorLut && (
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span>Color LUT Profile:</span>
                  <span className="text-purple-400 font-bold">{project.colorLut}</span>
                </div>
              )}
              {project.views && (
                <div className="flex justify-between border-b border-border/40 pb-1.5">
                  <span>Total Reach:</span>
                  <span className="text-yellow-400 font-bold">{project.views}</span>
                </div>
              )}
            </div>

            {/* Techniques Used */}
            {project.techniques && project.techniques.length > 0 && (
              <div className="pt-2">
                <div className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>TECHNIQUES APPLIED</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techniques.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-primary/10 px-2 py-1 text-[10px] text-primary border border-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description & Action */}
        <div className="mt-6 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
            {project.description || "High-retention video edit crafted by Baycon Motion."}
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
