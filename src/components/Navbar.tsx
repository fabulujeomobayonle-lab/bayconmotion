import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sound } from "./SoundSystem";
import { Volume2, VolumeX, Sparkles, Menu, X, Shield, Film, Sliders, Layers, DollarSign, Mail, Home } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleAudio = () => {
    const state = sound.toggleSound();
    setSoundOn(state);
    if (state) sound.playClick(900);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/services", label: "Services", icon: Layers },
    { to: "/portfolio", label: "Work", icon: Film },
    { to: "/showcase", label: "Motion Lab", icon: Sliders, badge: "CRAZY" },
    { to: "/about", label: "About", icon: Sparkles },
    { to: "/pricing", label: "Pricing", icon: DollarSign },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-b from-background/90 via-background/40 to-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Lockup */}
        <Link
          to="/"
          onMouseEnter={() => sound.playClick(600)}
          className="brand-lockup group flex items-center gap-2 font-display text-lg font-black tracking-widest text-foreground transition-transform hover:scale-105"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 border border-primary/60 text-primary shadow-[0_0_15px_rgba(255,26,26,0.5)] group-hover:bg-primary group-hover:text-black transition-all duration-300">
            <span className="font-impact text-xl">B</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="neon-text text-base leading-none tracking-widest font-black">BAYCON</span>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">MOTION & EDIT</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = currentPath === link.to;
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onMouseEnter={() => sound.playClick(750)}
                  data-cursor={link.label.toUpperCase()}
                  className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/40 shadow-[0_0_12px_rgba(255,26,26,0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary animate-pulse" : ""}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-cyan-500/20 px-1.5 py-0.2 font-mono text-[8px] font-bold text-cyan-400 border border-cyan-400/40 animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Controls & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleAudio}
            onMouseEnter={() => sound.playClick(500)}
            data-cursor="AUDIO FX"
            title={soundOn ? "Mute Futuristic Sound FX" : "Enable Sound FX"}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
              soundOn
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(0,255,249,0.3)]"
                : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Admin link */}
          <Link
            to="/admin"
            onMouseEnter={() => sound.playClick(600)}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>ADMIN</span>
          </Link>

          {/* Book / Contact CTA */}
          <Link
            to="/contact"
            onMouseEnter={() => sound.playGlitch()}
            data-cursor="BOOK EDIT"
            className="cyber-button-sm group relative overflow-hidden rounded-lg bg-primary px-4 py-2 text-xs font-bold tracking-wider text-black shadow-[0_0_20px_rgba(255,26,26,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,26,26,0.9)]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>START PROJECT</span>
              <span className="text-sm">→</span>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleAudio}
            className={`flex h-8 w-8 items-center justify-center rounded-md border ${
              soundOn ? "border-cyan-500/40 text-cyan-400" : "border-border text-muted-foreground"
            }`}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => {
              sound.playClick(600);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 p-4 backdrop-blur-2xl md:hidden animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[9px] font-mono text-cyan-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-lg bg-primary py-3 text-center text-xs font-bold tracking-wider text-black shadow-lg"
              >
                START YOUR PROJECT NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
