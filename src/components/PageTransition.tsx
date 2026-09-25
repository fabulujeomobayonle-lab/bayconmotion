import { useEffect, useState } from "react";
import { sound } from "./SoundSystem";

export function PageTransitionTrigger({ pathname }: { pathname: string }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    sound.playShutter();

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9990] flex flex-col justify-between overflow-hidden">
      {/* Top Shuttle Blade */}
      <div className="h-1/2 w-full bg-background border-b-2 border-primary shadow-[0_10px_40px_rgba(255,26,26,0.8)] animate-shuttle-down flex items-end justify-center pb-4">
        <div className="flex items-center gap-4 text-primary font-mono text-xs font-bold tracking-widest uppercase">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          RENDERING FRAME MATRIX...
        </div>
      </div>

      {/* Center Laser Beam */}
      <div className="h-[4px] w-full bg-cyan-400 shadow-[0_0_20px_#00fff9] animate-pulse" />

      {/* Bottom Shuttle Blade */}
      <div className="h-1/2 w-full bg-background border-t-2 border-primary shadow-[0_-10px_40px_rgba(255,26,26,0.8)] animate-shuttle-up flex items-start justify-center pt-4">
        <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          PATH: {pathname}
        </div>
      </div>
    </div>
  );
}
