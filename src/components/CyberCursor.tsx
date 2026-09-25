import { useEffect, useRef, useState } from "react";

export function CyberCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("a, button, [data-cursor], input, select, textarea");
        if (interactive) {
          setIsHovering(true);
          const customLabel = interactive.getAttribute("data-cursor");
          if (customLabel) {
            setHoverText(customLabel);
          } else if (interactive.tagName === "A") {
            setHoverText("NAVIGATE");
          } else if (interactive.tagName === "BUTTON") {
            setHoverText("ACTION");
          } else {
            setHoverText("EDIT");
          }
        } else {
          setIsHovering(false);
          setHoverText(null);
        }
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const loop = () => {
      // Smooth lerp for ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${
          isHovering ? "scale(1.8)" : "scale(1)"
        }`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isHovering]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Precision center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)] transition-opacity duration-300"
      />

      {/* Holographic glowing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-primary/70 transition-all duration-150 ease-out ${
          isHovering
            ? "h-16 w-16 bg-primary/10 border-primary shadow-[0_0_24px_rgba(255,26,26,0.5)] backdrop-blur-[2px]"
            : "h-10 w-10 border-primary/40 bg-transparent"
        }`}
      >
        {/* Crosshair accents */}
        <div className="absolute -top-1 left-1/2 -ml-[1px] h-2 w-[2px] bg-primary/80" />
        <div className="absolute -bottom-1 left-1/2 -ml-[1px] h-2 w-[2px] bg-primary/80" />
        <div className="absolute top-1/2 -left-1 -mt-[1px] h-[2px] w-2 bg-primary/80" />
        <div className="absolute top-1/2 -right-1 -mt-[1px] h-[2px] w-2 bg-primary/80" />

        {hoverText && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-primary border border-primary/30 shadow-lg">
            {hoverText}
          </div>
        )}
      </div>
    </div>
  );
}
