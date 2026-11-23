import { useState, useRef, useCallback, useEffect } from "react";
import { sound } from "./SoundSystem";
import {
  SlidersHorizontal,
  Sparkles,
  Flame,
  Eye,
  Film,
  Sliders,
  Maximize2,
  Check,
  Zap,
} from "lucide-react";

import beforeImg from "@/assets/grade-before.jpg";
import afterImg from "@/assets/grade-after.jpg";

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    sound.playClick(750);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
      sound.playClick(600);
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
      sound.playClick(600);
    }
  };

  return (
    <div className="relative rounded-3xl border border-cyan-400/40 bg-card/90 p-5 md:p-7 shadow-[0_0_60px_rgba(0,246,255,0.2)] backdrop-blur-2xl">
      {/* Studio Program Monitor Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-2.5 py-1 border border-red-500/50 text-primary font-mono text-xs font-bold shadow-[0_0_15px_rgba(255,0,60,0.3)]">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="tracking-wider">DAVINCI ACES A/B MONITOR</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-300 tracking-widest hidden sm:inline">
            TIMECODE: 00:02:18:04
          </span>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              sound.playClick(650);
              setSliderPos(0);
            }}
            className={`rounded-lg px-2.5 py-1 border transition-all ${
              sliderPos <= 5
                ? "border-primary bg-primary/25 text-white"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            RAW LOG (0%)
          </button>
          <button
            onClick={() => {
              sound.playClick(700);
              setSliderPos(50);
            }}
            className={`rounded-lg px-2.5 py-1 border transition-all ${
              sliderPos > 40 && sliderPos < 60
                ? "border-cyan-400 bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(0,246,255,0.3)]"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            50/50 SPLIT
          </button>
          <button
            onClick={() => {
              sound.playClick(750);
              setSliderPos(100);
            }}
            className={`rounded-lg px-2.5 py-1 border transition-all ${
              sliderPos >= 95
                ? "border-cyan-400 bg-cyan-500/25 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            GRADED (100%)
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Before and after color grade comparison slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 select-none cursor-ew-resize shadow-2xl group focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-black"
      >
        {/* UNDERNEATH LAYER: AFTER EDIT (GRADED CINEMATIC) */}
        <img
          src={afterImg}
          alt="After: Baycon Hollywood Cinematic Color Grade"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="eager"
        />

        {/* AFTER BADGE & METRICS (RIGHT SIDE) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 border border-cyan-400/60 font-mono text-[11px] font-black text-cyan-300 shadow-[0_0_20px_rgba(0,246,255,0.4)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>AFTER: BAYCON CINEMATIC GRADE</span>
          </div>
          <span className="font-mono text-[9px] text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
            ACES 10-BIT • FILM GRAIN • BALANCED SKIN
          </span>
        </div>

        {/* TOP LAYER: BEFORE RAW (CLIPPED OVERLAY - FLAT LOG) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImg}
            alt="Before: Flat Raw Unedited Camera Log Footage"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="eager"
          />

          {/* BEFORE BADGE (LEFT SIDE) */}
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 border border-red-500/60 font-mono text-[11px] font-black text-red-400 shadow-[0_0_20px_rgba(255,0,60,0.4)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>BEFORE: RAW UNGRADED LOG</span>
            </div>
            <span className="font-mono text-[9px] text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
              FLAT S-LOG • LOW CONTRAST • DULL
            </span>
          </div>
        </div>

        {/* SLIDING VERTICAL DIVIDER LINE */}
        <div
          className="absolute inset-y-0 -ml-[1.5px] w-[3px] bg-gradient-to-b from-cyan-400 via-white to-primary pointer-events-none shadow-[0_0_20px_#00f6ff] z-20"
          style={{ left: `${sliderPos}%` }}
        />

        {/* SLIDER HANDLE / SCRUBBER BADGE */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-6 z-30 pointer-events-none transition-transform duration-75 group-hover:scale-110"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-white to-primary text-black shadow-[0_0_35px_rgba(0,246,255,0.9)] border-2 border-white">
            <SlidersHorizontal className="h-6 w-6 font-black" />
          </div>
        </div>

        {/* BOTTOM INSTRUCTION PILL */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none rounded-full bg-black/80 px-4 py-1.5 border border-white/20 backdrop-blur-md font-mono text-[11px] font-bold text-slate-200 tracking-wider shadow-xl flex items-center gap-2">
          <span className="text-cyan-400">◀</span>
          <span>DRAG SLIDER TO REVEAL TRANSFORMATION</span>
          <span className="text-primary">▶</span>
        </div>
      </div>

      {/* Footer Specs Console */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
        <div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase">COLOR SCIENCE</span>
          <span className="font-bold text-cyan-300">ACEScc 1.3 / DCI-P3</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase">DYNAMIC RANGE</span>
          <span className="font-bold text-emerald-400">14.5+ STOPS RECOVERED</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase">SKIN-TONE MATRIX</span>
          <span className="font-bold text-amber-300">TRUE TONE ISOLATION</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase">OUTPUT PIPELINE</span>
          <span className="font-bold text-primary">PRORES 422 HQ / 4K</span>
        </div>
      </div>
    </div>
  );
}
