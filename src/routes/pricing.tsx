import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { InteractiveQuoteCalculator } from "@/components/InteractiveQuoteCalculator";
import { sound } from "@/components/SoundSystem";
import { DollarSign, Check, Zap, Sparkles, Shield, HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — Baycon Video Editing Studio" },
      { name: "description", content: "Transparent pricing for video editing packages. Single edits, monthly retainers, and enterprise scale content engines." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const pricingTiers = [
    {
      name: "SINGLE EDIT SPARK",
      price: "$199",
      desc: "Perfect for testing Baycon's editing style on a single video.",
      badge: "PAY PER EDIT",
      color: "border-border",
      features: [
        "1 Video Edit (Reel or YouTube < 10m)",
        "Kinetic Captions & Sound FX",
        "Hollywood Color Grading",
        "48h Turnaround SLA",
        "2 Revision Cycles Included",
      ],
    },
    {
      name: "CREATOR GROWTH ENGINE",
      price: "$999",
      period: "/month",
      desc: "Our most popular monthly retainer for active creators.",
      badge: "MOST POPULAR",
      popular: true,
      color: "border-primary shadow-[0_0_40px_rgba(255,26,26,0.3)]",
      features: [
        "10 Vertical Reels/Shorts per month",
        "OR 4 Long-Form YouTube Videos",
        "Custom 3D Motion Graphics & Intros",
        "Dedicated Senior Editor + Colorist",
        "24-36h Expedited Turnaround SLA",
        "Unlimited Revision Cycles",
        "Dedicated Slack Channel",
      ],
    },
    {
      name: "EMPIRE SCALE RETAINER",
      price: "$2,499",
      period: "/month",
      desc: "Full-scale post-production engine for high-velocity brands.",
      badge: "ENTERPRISE",
      color: "border-cyan-400 shadow-[0_0_40px_rgba(0,255,249,0.2)]",
      features: [
        "30 Vertical Reels/Shorts per month",
        "AND 8 Long-Form YouTube Masterclasses",
        "Full 3D VFX & Cinema 4D Animations",
        "Priority 12-24h Rush SLA",
        "Thumbnail Design & A/B Variants",
        "Dedicated Account Manager",
      ],
    },
  ];

  const faqs = [
    {
      q: "How does the turnaround SLA work?",
      a: "Depending on your selected plan or quote speed, standard edits are completed within 48 hours. Rush edits can be delivered in 12-24 hours. If we miss the deadline, your edit is 100% free.",
    },
    {
      q: "What if I need revisions on an edit?",
      a: "All our monthly plans come with unlimited revision cycles until you are 100% satisfied. We provide Frame.io review links where you can leave timestamped comments directly on the video.",
    },
    {
      q: "Do you handle raw 4K video files?",
      a: "Yes! We support 4K, 8K RED RAW, ProRes, Log, and smartphone 4K footage via Google Drive, Dropbox, or Frame.io uploads.",
    },
    {
      q: "Can I pause or cancel my monthly retainer?",
      a: "Yes, you can pause or cancel your monthly retainer anytime with zero cancellation fees or lock-in contracts.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/pricing" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)] mb-6">
            <DollarSign className="h-3.5 w-3.5" />
            <span>TRANSPARENT PRICING • ZERO LOCK-IN CONTRACTS</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            SELECT YOUR <span className="text-primary neon-text">EDITING ENGINE</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Choose a monthly retainer or calculate a custom package tailored to your exact video specs.
          </p>
        </section>

        {/* PRICING TIERS */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-3xl border bg-card/90 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${tier.color}`}
              >
                {tier.badge && (
                  <span
                    className={`absolute top-6 right-6 rounded-full px-3 py-1 font-mono text-[10px] font-bold ${
                      tier.popular
                        ? "bg-primary text-black shadow-[0_0_15px_rgba(255,26,26,0.8)]"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono min-h-[36px]">
                    {tier.desc}
                  </p>

                  <div className="my-6">
                    <span className="font-impact text-4xl font-black text-foreground">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs text-muted-foreground font-sans border-t border-border pt-6">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/contact"
                  onMouseEnter={() => sound.playGlitch()}
                  className={`mt-8 w-full rounded-xl py-3 text-center font-display text-xs font-bold tracking-widest transition-all ${
                    tier.popular
                      ? "bg-primary text-black shadow-[0_0_25px_rgba(255,26,26,0.8)] hover:bg-primary/90"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  SUBSCRIBE NOW →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CUSTOM CALCULATOR SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <InteractiveQuoteCalculator />
        </section>

        {/* FAQ SECTION */}
        <section className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide">
              FREQUENTLY ASKED <span className="text-cyan-400 neon-text">QUESTIONS</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Everything you need to know about working with Baycon.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="rounded-2xl border border-border/80 bg-card/80 px-6 backdrop-blur-xl"
              >
                <AccordionTrigger className="font-display text-sm font-bold text-foreground hover:text-primary transition-colors text-left py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground font-sans leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  );
}
