import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { sound } from "./SoundSystem";
import { Shield, Sparkles, Send, Terminal, Play, Cpu } from "lucide-react";

export function Footer() {
  const [utcTime, setUtcTime] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toISOString().slice(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        sound.playSuccess();
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSecretClick = () => {
    sound.playClick(900);
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 5) {
      sound.playSuccess();
      setSecretClicks(0);
      window.location.href = "/admin";
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setSubscribed(true);
  };

  return (
    <footer className="relative border-t border-white/10 bg-background/95 pt-16 pb-8 overflow-hidden backdrop-blur-2xl">
      {/* Laser line gradient top with multi-stop neon */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary via-cyan-400 to-transparent shadow-[0_0_15px_rgba(255,0,60,0.8)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-black tracking-widest text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-600 text-black font-impact shadow-[0_0_20px_rgba(255,0,60,0.7)] border border-white/40">B</span>
              <span className="neon-text">BAYCON</span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              High-velocity video editing, kinetic motion graphics, and cinematic storytelling designed to command attention and scale digital creators.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#00ff66]" />
              <span>EDIT SUITE ACTIVE • 60 FPS • {utcTime}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>NAVIGATION</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>&gt; Home Studio</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>&gt; Editing Services</span>
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>&gt; Video Showcase</span>
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>&gt; Motion FX Lab</span>
                  <span className="text-[8px] bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 px-1 rounded shadow-[0_0_8px_rgba(0,246,255,0.4)]">CRAZY</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <span>&gt; Inside Baycon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Services & Inquiries */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>PRODUCTION</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link to="/services" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>&gt; Editing Capabilities</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>&gt; Custom Project Quote</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Glitch Newsletter */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>EDIT TRANSMISSION</span>
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              Subscribe to get viral edit breakdowns & motion presets directly.
            </p>

            {subscribed ? (
              <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/15 p-3 font-mono text-xs text-emerald-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FREQUENCY LINKED! ENJOY EDIT DROPS.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="creator@channel.com"
                  className="w-full rounded-xl border border-white/10 bg-card/80 px-3.5 py-2 text-xs text-foreground font-mono placeholder:text-slate-500 focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  onMouseEnter={() => sound.playClick(800)}
                  className="rounded-xl bg-gradient-to-r from-primary to-red-500 px-4 py-2 text-xs font-bold text-black hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,0,60,0.5)]"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="cursor-pointer select-none hover:text-cyan-300 transition-colors" onClick={handleSecretClick} title="Quantum Terminal Link">
            © {new Date().getFullYear()} BAYCON MOTION & EDITING STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => sound.playGlitch()}>
              DA VINCI • AFTER EFFECTS • PREMIERE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
