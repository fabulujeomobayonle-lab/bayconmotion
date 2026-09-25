import { useState, useEffect, useRef } from "react";
import { sound } from "./SoundSystem";
import { Play, Pause, RotateCcw, Volume2, Sparkles, Layers, Sliders, Film } from "lucide-react";

export function InteractiveTimeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(10); // 10 seconds
  const [activeLayers, setActiveLayers] = useState({
    talkingHead: true,
    motionFX: true,
    soundDesign: true,
    colorGrading: true,
    captions: true,
  });

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      sound.playClick(400);
      lastTimeRef.current = performance.now();
      const step = (now: number) => {
        if (lastTimeRef.current) {
          const delta = (now - lastTimeRef.current) / 1000;
          setCurrentTime((prev) => {
            const next = prev + delta;
            if (next >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTimeRef.current = now;
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, duration]);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    sound.playClick(700);
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="relative rounded-2xl border border-primary/40 bg-card/90 p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-widest text-primary">
            BAYCON TIMELINE ENGINE v4.2
          </span>
        </div>

        {/* Timecode display */}
        <div className="font-mono text-sm font-black tracking-widest text-cyan-400 bg-background/80 px-4 py-1.5 rounded-md border border-cyan-500/30">
          00:00:{currentTime.toFixed(2).padStart(5, "0")} / 00:00:{duration.toFixed(2)}
        </div>
      </div>

      {/* Video Monitor Preview */}
      <div className="my-6 relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-inner flex items-center justify-center">
        {/* Animated Simulated Video Canvas Output */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            activeLayers.colorGrading ? "contrast-125 saturate-150 brightness-105" : "grayscale"
          }`}
        >
          {/* Background Gradient & Motion Grid */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-background to-cyan-950/40" />

          {/* Talking Head Layer */}
          {activeLayers.talkingHead && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative flex flex-col items-center justify-center transition-transform duration-200"
                style={{
                  transform: `scale(${1 + Math.sin(currentTime * 4) * 0.04}) rotate(${
                    Math.cos(currentTime * 2) * 1.5
                  }deg)`,
                }}
              >
                <div className="h-28 w-28 rounded-full border-2 border-primary/60 bg-gradient-to-b from-primary/30 to-purple-600/30 p-1 shadow-[0_0_30px_rgba(255,26,26,0.4)] flex items-center justify-center text-4xl">
                  🎙️
                </div>
                <div className="mt-2 font-display text-sm font-bold text-white tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  CREATOR A-ROLL
                </div>
              </div>
            </div>
          )}

          {/* Motion FX Layer */}
          {activeLayers.motionFX && isPlaying && (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute top-1/4 left-1/4 h-20 w-20 rounded-full border border-cyan-400/80 bg-cyan-500/20 animate-ping"
                style={{ left: `${(currentTime * 20) % 80}%` }}
              />
              <div className="absolute bottom-6 left-6 font-mono text-xs text-cyan-400 bg-cyan-950/80 border border-cyan-500/50 px-2 py-1 rounded">
                FX: KINETIC_ZOOM + SPEED_RAMP
              </div>
            </div>
          )}

          {/* Captions Layer */}
          {activeLayers.captions && (
            <div className="absolute bottom-10 left-0 right-0 text-center">
              <span className="inline-block rounded-lg bg-yellow-400 px-4 py-1.5 font-impact text-lg md:text-xl text-black tracking-wide shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce">
                {currentTime < 2
                  ? "🔥 STOP THE SCROLL!"
                  : currentTime < 5
                  ? "⚡ EDIT LIKE A MILLIONAIRE"
                  : currentTime < 8
                  ? "📈 10X YOUR ENGAGEMENT"
                  : "🚀 BOOK BAYCON TODAY!"}
              </span>
            </div>
          )}
        </div>

        {/* CRT Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

        {/* Play Overlay Button if Paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="group relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-black shadow-[0_0_30px_rgba(255,26,26,0.8)] transition-transform hover:scale-110"
          >
            <Play className="h-8 w-8 ml-1 fill-black" />
          </button>
        )}
      </div>

      {/* Transport Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-black shadow-md hover:bg-primary/90 transition-all"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-black" />}
            <span>{isPlaying ? "PAUSE TIMELINE" : "PLAY TIMELINE"}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick(300);
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="text-xs font-mono text-muted-foreground hidden sm:block">
          SCRUB TRACKS BELOW TO TEST EFFECTS
        </div>
      </div>

      {/* Timeline Track Scrubber */}
      <div className="relative mb-6 h-3 w-full rounded-full bg-background border border-border overflow-hidden cursor-pointer"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const pct = (e.clientX - rect.left) / rect.width;
             setCurrentTime(pct * duration);
           }}>
        <div
          className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary transition-all duration-75 shadow-[0_0_12px_var(--primary)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Layer Toggles Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => toggleLayer("talkingHead")}
          className={`flex items-center justify-between rounded-lg p-3 border text-xs font-mono transition-all ${
            activeLayers.talkingHead
              ? "border-primary bg-primary/20 text-foreground shadow-[0_0_10px_rgba(255,26,26,0.3)]"
              : "border-border/60 bg-background/50 text-muted-foreground"
          }`}
        >
          <span>V1: TALKING HEAD</span>
          <span className={`h-2 w-2 rounded-full ${activeLayers.talkingHead ? "bg-primary" : "bg-muted"}`} />
        </button>

        <button
          onClick={() => toggleLayer("motionFX")}
          className={`flex items-center justify-between rounded-lg p-3 border text-xs font-mono transition-all ${
            activeLayers.motionFX
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,255,249,0.3)]"
              : "border-border/60 bg-background/50 text-muted-foreground"
          }`}
        >
          <span>V2: MOTION FX</span>
          <span className={`h-2 w-2 rounded-full ${activeLayers.motionFX ? "bg-cyan-400" : "bg-muted"}`} />
        </button>

        <button
          onClick={() => toggleLayer("captions")}
          className={`flex items-center justify-between rounded-lg p-3 border text-xs font-mono transition-all ${
            activeLayers.captions
              ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
              : "border-border/60 bg-background/50 text-muted-foreground"
          }`}
        >
          <span>V3: ANIM CAPTIONS</span>
          <span className={`h-2 w-2 rounded-full ${activeLayers.captions ? "bg-yellow-400" : "bg-muted"}`} />
        </button>

        <button
          onClick={() => toggleLayer("colorGrading")}
          className={`flex items-center justify-between rounded-lg p-3 border text-xs font-mono transition-all ${
            activeLayers.colorGrading
              ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              : "border-border/60 bg-background/50 text-muted-foreground"
          }`}
        >
          <span>FX: COLOR LUT</span>
          <span className={`h-2 w-2 rounded-full ${activeLayers.colorGrading ? "bg-purple-400" : "bg-muted"}`} />
        </button>

        <button
          onClick={() => toggleLayer("soundDesign")}
          className={`flex items-center justify-between rounded-lg p-3 border text-xs font-mono transition-all ${
            activeLayers.soundDesign
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
              : "border-border/60 bg-background/50 text-muted-foreground"
          }`}
        >
          <span>A1: AUDIO DESIGN</span>
          <span className={`h-2 w-2 rounded-full ${activeLayers.soundDesign ? "bg-emerald-400" : "bg-muted"}`} />
        </button>
      </div>
    </div>
  );
}
