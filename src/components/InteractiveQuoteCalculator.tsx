import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { sound } from "./SoundSystem";
import { Calculator, Check, Zap, Sparkles, DollarSign, Clock, ShieldCheck } from "lucide-react";

export function InteractiveQuoteCalculator() {
  const [videoType, setVideoType] = useState<"reels" | "youtube" | "commercial" | "documentary">("reels");
  const [quantity, setQuantity] = useState<number>(4);
  const [speed, setSpeed] = useState<"standard" | "rush" | "express">("standard");
  const [fxLevel, setFxLevel] = useState<"basic" | "advanced" | "godmode">("advanced");

  // Base pricing matrix
  const basePrices = {
    reels: 120,
    youtube: 350,
    commercial: 750,
    documentary: 1200,
  };

  const speedMultipliers = {
    standard: 1.0,
    rush: 1.35,
    express: 1.75,
  };

  const fxMultipliers = {
    basic: 0.85,
    advanced: 1.15,
    godmode: 1.5,
  };

  const basePricePerVideo = basePrices[videoType];
  const unitPrice = Math.round(
    basePricePerVideo * speedMultipliers[speed] * fxMultipliers[fxLevel]
  );
  const totalPrice = unitPrice * quantity;
  const savings = quantity >= 8 ? Math.round(totalPrice * 0.15) : 0;
  const finalPrice = totalPrice - savings;

  return (
    <div className="rounded-2xl border border-primary/40 bg-card/90 p-6 md:p-8 shadow-[0_0_50px_rgba(255,26,26,0.15)] backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            INSTANT CUSTOM QUOTE CALCULATOR
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Customize video specs & see live estimate transparently.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Options Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Video Format */}
          <div>
            <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
              1. SELECT VIDEO FORMAT
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "reels", name: "Reels / Shorts", desc: "< 60 Sec Vertical" },
                { id: "youtube", name: "YouTube Long", desc: "8 - 15 Mins Talking Head" },
                { id: "commercial", name: "Commercial Ad", desc: "High Conversion Ad" },
                { id: "documentary", name: "Docu-Style", desc: "Cinematic Narrative" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick(600);
                    setVideoType(item.id as any);
                  }}
                  className={`rounded-xl p-3 border text-left transition-all ${
                    videoType === item.id
                      ? "border-primary bg-primary/20 text-foreground shadow-[0_0_15px_rgba(255,26,26,0.3)]"
                      : "border-border/60 bg-background/50 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="font-bold text-xs">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Quantity Slider */}
          <div>
            <div className="flex justify-between font-mono text-xs mb-2">
              <span className="text-primary font-bold">2. NUMBER OF VIDEOS</span>
              <span className="text-foreground font-bold">{quantity} Videos / Month</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => {
                sound.playClick(750);
                setQuantity(Number(e.target.value));
              }}
              className="w-full accent-primary cursor-pointer"
            />
            {quantity >= 8 && (
              <div className="mt-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>15% BULK DISCOUNT APPLIED!</span>
              </div>
            )}
          </div>

          {/* 3. Turnaround Speed */}
          <div>
            <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
              3. TURNAROUND SPEED
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "standard", name: "Standard (48h)", multiplier: "1.0x" },
                { id: "rush", name: "Rush (24h)", multiplier: "1.35x" },
                { id: "express", name: "Express (12h)", multiplier: "1.75x" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick(650);
                    setSpeed(item.id as any);
                  }}
                  className={`rounded-xl p-3 border text-center transition-all ${
                    speed === item.id
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,255,249,0.3)]"
                      : "border-border/60 bg-background/50 text-muted-foreground hover:border-cyan-400/40"
                  }`}
                >
                  <div className="font-bold text-xs">{item.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{item.multiplier} RATE</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Motion FX Level */}
          <div>
            <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
              4. MOTION FX & EDIT COMPLEXITY
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "basic", name: "Essential Cuts", desc: "Clean Pacing + Subtitles" },
                { id: "advanced", name: "Viral Kinetic", desc: "Sound Design + B-Roll + FX" },
                { id: "godmode", name: "Cyber Godmode", desc: "3D VFX + Custom Presets" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick(700);
                    setFxLevel(item.id as any);
                  }}
                  className={`rounded-xl p-3 border text-left transition-all ${
                    fxLevel === item.id
                      ? "border-purple-400 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : "border-border/60 bg-background/50 text-muted-foreground hover:border-purple-400/40"
                  }`}
                >
                  <div className="font-bold text-xs">{item.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Summary Card */}
        <div className="rounded-xl border border-primary/50 bg-background/80 p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(255,26,26,0.2)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs text-muted-foreground">CALCULATED ESTIMATE</span>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                LIVE
              </span>
            </div>

            <div>
              <div className="font-display text-3xl md:text-4xl font-black text-primary neon-text">
                ${finalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                ${unitPrice}/video • {quantity} videos
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-muted-foreground pt-2">
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="text-foreground capitalize">{videoType}</span>
              </div>
              <div className="flex justify-between">
                <span>Turnaround:</span>
                <span className="text-foreground capitalize">{speed}</span>
              </div>
              <div className="flex justify-between">
                <span>FX Tier:</span>
                <span className="text-foreground capitalize">{fxLevel}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Bulk Discount:</span>
                  <span>-${savings}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-[11px] text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Unlimited Revision Cycles</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Dedicated Editor & Motion Designer</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Source Files & Render Exports</span>
              </div>
            </div>
          </div>

          <Link
            to="/contact"
            onMouseEnter={() => sound.playGlitch()}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-center text-xs font-bold tracking-widest text-black shadow-[0_0_20px_rgba(255,26,26,0.6)] hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <span>LOCK IN THIS PACKAGE</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
