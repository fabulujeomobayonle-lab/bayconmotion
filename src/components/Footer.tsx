import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { sound } from "./SoundSystem";
import { Shield, Sparkles, Send, Terminal, Play, Cpu } from "lucide-react";

export function Footer() {
  const [utcTime, setUtcTime] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTime(d.toISOString().slice(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setSubscribed(true);
  };

  return (
    <footer className="relative border-t border-border/80 bg-background/90 pt-16 pb-8 overflow-hidden backdrop-blur-lg">
      {/* Laser line gradient top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-black tracking-widest">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-black font-impact">B</span>
              <span className="neon-text">BAYCON</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              High-velocity video editing, motion graphics, and cinematic storytelling designed to command attention and scale digital brands.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>STUDIO ONLINE • {utcTime}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-foreground uppercase mb-4 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>NAVIGATION</span>
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Home Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Editing Services</span>
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Video Portfolio</span>
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>> Motion FX Lab</span>
                  <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1 rounded">CRAZY</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Inside Baycon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Arsenal & Pricing */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-foreground uppercase mb-4 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>SERVICES & GEAR</span>
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Pricing & Plans</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>> Custom Project Quote</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1 text-muted-foreground/80">
                  <span>> Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Glitch Newsletter */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-foreground uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>EDIT TRANSMISSION</span>
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Subscribe to get viral edit breakdowns & motion presets directly.
            </p>

            {subscribed ? (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FREQUENCY LINKED! ENJOY EDIT DROPS.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="creator@channel.com"
                  className="w-full rounded-md border border-border bg-card/60 px-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  onMouseEnter={() => sound.playClick(800)}
                  className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-black hover:bg-primary/80 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div>
            © {new Date().getFullYear()} BAYCON MOTION & EDITING STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer" onClick={() => sound.playGlitch()}>
              FPS: 60.0
            </span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => sound.playGlitch()}>
              RENDER ENGINE: VITE + TANSTACK
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
