import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { sound } from "@/components/SoundSystem";
import { useState } from "react";
import { Mail, Send, CheckCircle2, Sparkles, Upload, Calendar, ShieldCheck, Clock, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Start Your Project — Baycon Contact & Booking Portal" },
      { name: "description", content: "Book your video editing session with Baycon. Submit raw footage briefs, select turnaround speed, and schedule a call." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    videoType: "Reels / Shorts",
    volume: "4-8 Videos / Month",
    driveLink: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/contact" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)] mb-6">
            <Mail className="h-3.5 w-3.5" />
            <span>24/7 PROJECT INTAKE PORTAL</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            START YOUR <span className="text-primary neon-text">EDIT SESSION</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Fill in your project specs below. We reply with a custom proposal and sample cut within 4 hours.
          </p>
        </section>

        {/* MAIN FORM CONTAINER */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="rounded-3xl border border-primary/50 bg-card/90 p-8 sm:p-12 shadow-[0_0_60px_rgba(255,26,26,0.2)] backdrop-blur-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>

                <h2 className="font-impact text-3xl text-foreground uppercase tracking-wide">
                  PROJECT TRANSMISSION <span className="text-emerald-400">RECEIVED!</span>
                </h2>

                <p className="max-w-md mx-auto text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed">
                  Thank you, <span className="text-primary font-bold">{formData.name}</span>! Our lead editor is reviewing your brief. We will send a confirmation email to <span className="text-cyan-400 font-bold">{formData.email}</span> within 4 hours.
                </p>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      sound.playClick(600);
                      setSubmitted(false);
                    }}
                    className="rounded-xl border border-border bg-background px-6 py-3 font-mono text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                  >
                    SUBMIT ANOTHER BRIEF
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                      YOUR NAME / BRAND
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Tech Founder"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Video Type */}
                  <div>
                    <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                      VIDEO FORMAT
                    </label>
                    <select
                      value={formData.videoType}
                      onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                    >
                      <option>Reels / Shorts (Vertical 9:16)</option>
                      <option>YouTube Long-Form (16:9)</option>
                      <option>High-Conversion Commercial Ad</option>
                      <option>Docu-Style / Film</option>
                    </select>
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                      MONTHLY ESTIMATED VOLUME
                    </label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground font-mono focus:border-primary focus:outline-none transition-colors"
                    >
                      <option>1-3 Single Edits</option>
                      <option>4-8 Videos / Month</option>
                      <option>10-20 Videos / Month</option>
                      <option>20+ Full Enterprise Scale</option>
                    </select>
                  </div>
                </div>

                {/* Drive Link */}
                <div>
                  <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                    RAW FOOTAGE LINK (GOOGLE DRIVE / DROPBOX)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formData.driveLink}
                      onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/80 pl-11 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                    <Upload className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="font-mono text-xs font-bold text-primary tracking-widest block mb-2">
                    PROJECT BRIEF & CREATIVE NOTES
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your target audience, editing style preferences, reference links..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onMouseEnter={() => sound.playGlitch()}
                  className="w-full rounded-xl bg-primary py-4 font-display text-sm font-bold tracking-widest text-black shadow-[0_0_30px_rgba(255,26,26,0.8)] hover:bg-primary/90 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>TRANSMIT BRIEF & REQUEST PROPOSAL</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
