import { useState, useRef, useEffect } from "react";
import { sound } from "./SoundSystem";
import { Sliders, Sparkles, Zap, Radio, Volume2, Cpu, RefreshCw } from "lucide-react";

export function InteractiveMotionLab() {
  const [glitchIntensity, setGlitchIntensity] = useState(50);
  const [rgbShift, setRgbShift] = useState(30);
  const [bloom, setBloom] = useState(70);
  const [scanlines, setScanlines] = useState(true);
  const [particleSpeed, setParticleSpeed] = useState(60);
  const [activeSynthNote, setActiveSynthNote] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02 * (particleSpeed / 50);
      const w = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const h = (canvas.height = 360);

      // Background reset
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      // Render crazy animated portal geometry
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const layers = 12;
      for (let i = 0; i < layers; i++) {
        const radius = (i * 20 + time * 30) % 220;
        const angle = time + i * 0.3;

        ctx.rotate(angle * 0.05);

        // RGB shift offset calculation
        const shiftX = (Math.random() - 0.5) * (rgbShift / 10);
        const shiftY = (Math.random() - 0.5) * (rgbShift / 10);

        // Neon Glow effect
        ctx.shadowColor = i % 2 === 0 ? "#ff1a1a" : "#00fff9";
        ctx.shadowBlur = (bloom / 100) * 25;

        // Draw hexagon / circle geometry
        ctx.beginPath();
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 26, 26, 0.7)" : "rgba(0, 255, 249, 0.7)";
        ctx.lineWidth = 2 + (bloom / 100) * 3;

        const sides = 6;
        for (let s = 0; s <= sides; s++) {
          const a = (s * Math.PI * 2) / sides;
          const px = Math.cos(a) * radius + shiftX;
          const py = Math.sin(a) * radius + shiftY;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Glitch horizontal slices
      if (Math.random() < glitchIntensity / 100) {
        const sliceY = Math.random() * h - h / 2;
        const sliceH = Math.random() * 30 + 5;
        const sliceOffsetX = (Math.random() - 0.5) * (glitchIntensity / 2);

        ctx.fillStyle = "rgba(0, 255, 249, 0.2)";
        ctx.fillRect(-w / 2 + sliceOffsetX, sliceY, w, sliceH);
      }

      ctx.restore();

      // CRT Scanlines
      if (scanlines) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 2);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [glitchIntensity, rgbShift, bloom, scanlines, particleSpeed]);

  const synthNotes = [
    { name: "SUB BASS", freq: 110 },
    { name: "REEL CUT", freq: 440 },
    { name: "CYBER GLITCH", freq: 880 },
    { name: "LASER SWIPE", freq: 1320 },
    { name: "DROP BASS", freq: 220 },
  ];

  const playSynth = (note: { name: string; freq: number }) => {
    setActiveSynthNote(note.name);
    sound.playClick(note.freq, "sawtooth");
    setTimeout(() => setActiveSynthNote(null), 300);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-card/90 p-6 shadow-[0_0_50px_rgba(0,255,249,0.15)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-cyan-400 animate-spin" />
          <span className="font-mono text-sm font-bold text-cyan-400 tracking-widest">
            LIVE MOTION FX & SHADER TUNER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGlitchIntensity(50);
              setRgbShift(30);
              setBloom(70);
              setScanlines(true);
              setParticleSpeed(60);
              sound.playGlitch();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>RESET DEFAULTS</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realtime Canvas Display */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-cyan-500/30 bg-black shadow-inner">
          <canvas ref={canvasRef} className="w-full h-[360px] block" />
          <div className="absolute top-3 left-3 flex items-center gap-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] text-cyan-400 border border-cyan-500/40">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>REALTIME SHADER FEED</span>
          </div>
        </div>

        {/* FX Control Sliders */}
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-background/60 p-4">
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold text-foreground tracking-widest flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span>PARAMETER TUNERS</span>
            </h4>

            {/* Glitch Intensity */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">GLITCH MATRIX</span>
                <span className="text-primary font-bold">{glitchIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={glitchIntensity}
                onChange={(e) => setGlitchIntensity(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* RGB Shift */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">RGB CHROMATIC SHIFT</span>
                <span className="text-cyan-400 font-bold">{rgbShift}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rgbShift}
                onChange={(e) => setRgbShift(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Neon Bloom */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">NEON BLOOM & STRENGTH</span>
                <span className="text-purple-400 font-bold">{bloom}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bloom}
                onChange={(e) => setBloom(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Motion Speed */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">PARTICLE VELOCITY</span>
                <span className="text-yellow-400 font-bold">{particleSpeed} FPS</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={particleSpeed}
                onChange={(e) => setParticleSpeed(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* CRT Scanline Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="font-mono text-xs text-muted-foreground">CRT SCANLINES</span>
              <button
                onClick={() => {
                  sound.playClick(600);
                  setScanlines(!scanlines);
                }}
                className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all ${
                  scanlines ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40" : "bg-muted text-muted-foreground"
                }`}
              >
                {scanlines ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Soundboard Pads */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <h4 className="font-display text-xs font-bold text-foreground tracking-widest mb-3 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-emerald-400" />
          <span>AUDIO FX SOUNDBOARD (SYNTH PADS)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {synthNotes.map((note) => (
            <button
              key={note.name}
              onClick={() => playSynth(note)}
              className={`rounded-xl p-3 border font-mono text-xs font-bold transition-all ${
                activeSynthNote === note.name
                  ? "border-emerald-400 bg-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105"
                  : "border-border/60 bg-background/50 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"
              }`}
            >
              <div>{note.name}</div>
              <div className="text-[9px] text-muted-foreground font-normal mt-1">{note.freq} Hz</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
