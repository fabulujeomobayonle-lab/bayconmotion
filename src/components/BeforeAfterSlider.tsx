import { useState, useRef } from "react";
import { sound } from "./SoundSystem";
import { SlidersHorizontal, Sparkles, Flame, Eye, Film, Volume2, Activity, Play } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    setSliderPos(pct);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="relative rounded-3xl border border-primary/50 bg-card/90 p-5 shadow-[0_0_60px_rgba(255,0,60,0.25)] backdrop-blur-2xl">
      {/* Studio Program Monitor Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md bg-red-500/20 px-2 py-0.5 border border-red-500/50 text-primary font-mono text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>A/B COMPARISON ENGINE</span>
          </div>
          <span className="font-mono text-xs font-bold text-foreground tracking-widest hidden sm:inline">
            TIMECODE: 00:01:24:18
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="text-cyan-400 font-bold hidden md:inline">4K DCI • 59.94 FPS</span>
          <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-slate-300">
            DRAG SCRUBBER
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => {
          sound.playClick(750);
          handleMove(e.clientX);
        }}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize shadow-2xl"
      >
        {/* AFTER EDIT (FULL COVERAGE UNDERNEATH - VIVID CINEMATIC) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/90 via-background to-cyan-950 p-6 sm:p-8 flex flex-col justify-between contrast-125 saturate-150">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 rounded-lg bg-black/70 border border-emerald-400/50 px-3 py-1 text-emerald-400 font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,255,102,0.3)]">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>RETENTION: 96.4%</span>
            </div>
            <span className="rounded-full bg-gradient-to-r from-primary to-pink-500 px-4 py-1 font-impact text-xs text-black tracking-widest shadow-[0_0_20px_rgba(255,0,60,0.8)] border border-white/40">
              AFTER: BAYCON CINEMATIC EDIT 🔥
            </span>
          </div>

          <div className="space-y-4 max-w-lg">
            <span className="inline-block rounded-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 px-4 py-2 font-impact text-base sm:text-xl text-black shadow-[0_0_25px_rgba(255,190,11,0.7)] animate-bounce">
              ⚡ 10X RETENTION HOOK SURGERY!
            </span>
            <div className="font-mono text-xs text-cyan-300 flex flex-wrap items-center gap-2 bg-black/60 p-2.5 rounded-xl border border-cyan-400/40 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>SFX • 0.6S CUTS • 10-BIT ACES LUT • SPATIAL SUB-BASS</span>
            </div>
          </div>
        </div>

        {/* BEFORE RAW (CLIPPED OVERLAY - FLAT LOG PROFILE) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-neutral-900 grayscale brightness-70 border-r-2 border-primary shadow-[15px_0_30px_rgba(0,0,0,0.9)]"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between w-[650px] md:w-[900px]">
            <div>
              <span className="rounded-lg bg-neutral-800/90 px-3 py-1.5 font-mono text-xs text-neutral-400 border border-neutral-700">
                BEFORE: RAW UNGRADED FOOTAGE (FLAT LOG)
              </span>
            </div>

            <div className="space-y-2 opacity-70 bg-black/50 p-4 rounded-xl border border-neutral-800 max-w-md">
              <p className="font-mono text-xs text-neutral-300">
                Dull skin tones, no kinetic pacing, flat audio, zero sound effects, audience drops in 3 seconds...
              </p>
            </div>
          </div>
        </div>

        {/* SLIDER HANDLE BAR */}
        <div
          className="pointer-events-none absolute inset-y-0 -ml-5 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-pink-500 text-black shadow-[0_0_30px_rgba(255,0,60,1)] border-2 border-white">
            <SlidersHorizontal className="h-5 w-5 font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
