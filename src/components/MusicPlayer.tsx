import { useState, useEffect, useRef } from "react";
import { musicEngine, TRACK_LIST, type MusicTrack } from "@/lib/MusicEngine";
import { sound } from "./SoundSystem";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Radio,
  Minimize2,
  Maximize2,
  Disc3,
  Music2,
  Sparkles,
} from "lucide-react";

export function MusicPlayer() {
  const [state, setState] = useState(() => musicEngine.getState());
  const [expanded, setExpanded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const unsub = musicEngine.subscribe(() => {
      setState(musicEngine.getState());
    });
    return unsub;
  }, []);

  // Equalizer canvas animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 240);
      const h = (canvas.height = 36);

      ctx.clearRect(0, 0, w, h);

      const freqData = musicEngine.getFrequencyData();
      const numBars = 24;
      const barWidth = (w - (numBars - 1) * 2) / numBars;

      for (let i = 0; i < numBars; i++) {
        // Read frequencies with fallback animated idle wave if not playing
        let val = freqData[i] || 0;
        if (!state.isPlaying) {
          val = Math.sin(Date.now() * 0.003 + i * 0.3) * 12 + 14;
        }

        const barHeight = Math.max(3, (val / 255) * h * 0.95);
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Gradient from crimson to cyan
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, i % 2 === 0 ? "#00f6ff" : "#ff003c");
        grad.addColorStop(1, "rgba(255, 0, 60, 0.2)");

        ctx.fillStyle = grad;
        ctx.shadowColor = i % 2 === 0 ? "#00f6ff" : "#ff003c";
        ctx.shadowBlur = state.isPlaying ? 8 : 2;

        ctx.beginPath();
        // Rounded top bars
        const r = Math.min(2, barWidth / 2);
        ctx.roundRect(x, y, barWidth, barHeight, [r, r, 0, 0]);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [state.isPlaying, expanded]);

  const handlePlayToggle = async () => {
    setUserInteracted(true);
    sound.playClick(800);
    musicEngine.toggle();
  };

  const handleNext = () => {
    sound.playClick(900);
    musicEngine.nextTrack();
  };

  const handlePrev = () => {
    sound.playClick(700);
    musicEngine.prevTrack();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    musicEngine.setVolume(val);
  };

  const handleMute = () => {
    sound.playClick(600);
    musicEngine.toggleMute();
  };

  const handleSelectTrack = (idx: number) => {
    sound.playClick(850);
    musicEngine.setTrack(idx);
    if (!state.isPlaying) {
      musicEngine.play();
    }
  };

  return (
    <aside
      aria-label="Studio Soundtrack Player"
      className="fixed bottom-4 right-4 z-50 transition-all duration-300 font-sans"
    >
      {/* EXPANDED PLAYER DOCK */}
      {expanded ? (
        <div className="w-[320px] sm:w-[360px] rounded-2xl border border-cyan-400/50 bg-card/95 p-5 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,246,255,0.25)] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 ${
                    state.isPlaying ? "animate-ping opacity-75" : "opacity-30"
                  }`}
                />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_10px_#00f6ff]" />
              </span>
              <div>
                <span className="font-mono text-[10px] tracking-widest text-cyan-300 font-bold block uppercase">
                  BAYCON AUDIO ENGINE
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  PROCEDURAL SYNTH // 0% CPU
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick(500);
                setExpanded(false);
              }}
              title="Minimize player"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Realtime Canvas Equalizer */}
          <div className="my-3 rounded-xl border border-white/10 bg-black/50 p-2.5">
            <div className="flex items-center justify-between pb-1 font-mono text-[9px] text-slate-400">
              <span>SPECTRUM ANALYZER</span>
              <span className={state.isPlaying ? "text-cyan-400 font-bold" : ""}>
                {state.isPlaying ? "● LIVE ACTIVE" : "IDLE"}
              </span>
            </div>
            <div className="w-full h-9">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>

          {/* Current Track Display */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold text-primary border border-primary/40">
                {state.currentTrack.genre}
              </span>
              <span className="font-mono text-[10px] text-cyan-400 font-bold">
                {state.currentTrack.bpm} BPM
              </span>
            </div>
            <h4 className="font-aesthetic text-base font-extrabold text-white tracking-wide truncate">
              {state.currentTrack.title}
            </h4>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {state.currentTrack.artist}
            </p>
          </div>

          {/* Track Selector Pills */}
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {TRACK_LIST.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(idx)}
                className={`rounded-lg px-2 py-1.5 text-left font-mono text-[9px] font-bold transition-all truncate border ${
                  state.trackIndex === idx
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,246,255,0.3)]"
                    : "border-border/60 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="truncate">0{idx + 1}. {t.title.split(" ")[0]}</div>
                <div className="text-[8px] text-slate-400 font-normal">{t.bpm} BPM</div>
              </button>
            ))}
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/80">
            {/* Playback buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                title="Previous track"
                className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={handlePlayToggle}
                title={state.isPlaying ? "Pause music" : "Play music"}
                className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-transform hover:scale-105 ${
                  state.isPlaying
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(255,0,60,0.8)]"
                    : "bg-gradient-to-r from-cyan-400 to-primary text-black shadow-[0_0_20px_rgba(0,246,255,0.8)]"
                }`}
              >
                {state.isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                title="Next track"
                className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 flex-1 max-w-[130px]">
              <button
                onClick={handleMute}
                title={state.isMuted ? "Unmute" : "Mute"}
                className="text-muted-foreground hover:text-cyan-400 transition-colors"
              >
                {state.isMuted || state.volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.isMuted ? 0 : state.volume}
                onChange={handleVolume}
                aria-label="Soundtrack Volume"
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      ) : (
        /* MINIMIZED FLOATING PILL */
        <div className="group flex items-center gap-2.5 rounded-full border border-cyan-400/60 bg-card/90 py-2 px-3.5 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,246,255,0.3)] hover:shadow-[0_0_35px_rgba(0,246,255,0.5)] transition-all">
          {/* Animated Vinyl Icon */}
          <button
            onClick={handlePlayToggle}
            data-cursor={state.isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-black shadow-[0_0_15px_rgba(0,246,255,0.6)] transition-transform hover:scale-110"
          >
            {state.isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
            {state.isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
            )}
          </button>

          {/* Track Ticker and Live Equalizer Bars */}
          <div
            onClick={() => {
              sound.playClick(600);
              setExpanded(true);
            }}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-cyan-300 font-bold tracking-widest uppercase flex items-center gap-1">
                <Music2 className="h-2.5 w-2.5" />
                {state.isPlaying ? "SOUNDTRACK ACTIVE" : "STUDIO BGM"}
              </span>
              <span className="font-aesthetic text-xs font-bold text-white tracking-wide max-w-[120px] sm:max-w-[160px] truncate">
                {state.currentTrack.title}
              </span>
            </div>

            {/* Dancing Equalizer Bars */}
            <div className="flex items-end gap-[3px] h-4 w-8 px-1">
              {[0.4, 0.9, 0.6, 1.0, 0.7].map((height, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-full transition-all duration-150 ${
                    state.isPlaying
                      ? "bg-cyan-400 shadow-[0_0_6px_#00f6ff] animate-pulse"
                      : "bg-white/30 h-1.5"
                  }`}
                  style={{
                    height: state.isPlaying ? `${Math.max(4, height * 16)}px` : "4px",
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => {
              sound.playClick(600);
              setExpanded(true);
            }}
            title="Open Audio Console"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
}
