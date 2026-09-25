import { useState, useRef } from "react";
import { sound } from "./SoundSystem";
import { SlidersHorizontal, Sparkles, Flame, Eye } from "lucide-react";

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
    <div className="relative rounded-2xl border border-primary/40 bg-card p-4 shadow-[0_0_50px_rgba(255,26,26,0.2)]">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary tracking-widest">
            BEFORE vs AFTER BAYCON EDIT SLIDER
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
          DRAG SLIDER TO SEE TRANSFORMATION
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-border select-none cursor-ew-resize"
      >
        {/* AFTER EDIT (FULL COVERAGE UNDERNEATH) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-background to-cyan-950 p-6 flex flex-col justify-between contrast-125 saturate-150">
          <div className="flex justify-end">
            <span className="rounded-full bg-primary/90 px-3 py-1 font-impact text-xs text-black tracking-widest shadow-[0_0_15px_rgba(255,26,26,0.8)]">
              AFTER: BAYCON CINEMATIC EDIT 🔥
            </span>
          </div>

          <div className="space-y-3">
            <span className="inline-block rounded bg-yellow-400 px-3 py-1 font-impact text-lg text-black shadow-lg animate-bounce">
              ⚡ 10X RETENTION HIGH-IMPACT HOOK!
            </span>
            <div className="font-mono text-xs text-cyan-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SFX + KINETIC TYPOGRAPHY + SOUND DESIGN + COLOR LUT</span>
            </div>
          </div>
        </div>

        {/* BEFORE RAW (CLIPPED OVERLAY) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-neutral-900 grayscale brightness-75 border-r-2 border-primary shadow-[10px_0_20px_rgba(0,0,0,0.8)]"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-between w-[600px] md:w-[800px]">
            <div>
              <span className="rounded bg-neutral-800 px-3 py-1 font-mono text-xs text-muted-foreground border border-neutral-700">
                BEFORE: RAW UNEDITED FOOTAGE
              </span>
            </div>

            <div className="space-y-2 opacity-60">
              <p className="font-mono text-xs text-neutral-400">
                Monotone voice, no visual cuts, dull lighting, zero retention hook...
              </p>
            </div>
          </div>
        </div>

        {/* SLIDER HANDLE BAR */}
        <div
          className="pointer-events-none absolute inset-y-0 -ml-4 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_20px_rgba(255,26,26,1)] border-2 border-white">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
