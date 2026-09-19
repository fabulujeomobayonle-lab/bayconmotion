import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
const supabase = supabaseTyped as unknown as {
  from: (table: string) => any;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baycon — Your Story. Our Edit. Unforgettable." },
      { name: "description", content: "Baycon is a professional video editing brand. Talking head editing, motion graphics, and cinematic video edits that stop the scroll." },
      { property: "og:title", content: "Baycon — Professional Video Editing" },
      { property: "og:description", content: "Talking head editing, motion graphics, and high-impact video edits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BayconHome,
});

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll                                                    */
/* ------------------------------------------------------------------ */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal");
            (e.target as HTMLElement).style.opacity = "";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id={id} ref={ref} data-motion-label={id?.replaceAll("-", " ")} className={`cyber-section motion-scene relative overflow-hidden px-6 py-24 md:py-32 ${className}`}>
      <div className="section-scan" aria-hidden="true" />
      <div className="scene-word scene-word-front" aria-hidden="true">{id}</div>
      <div className="scene-word scene-word-back" aria-hidden="true">{id}</div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#portfolio", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="brand-lockup group font-display text-lg font-black tracking-widest neon-text sm:text-xl">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BAYCON</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-signal hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Admin
            </a>
            <a
              href="#contact"
              className="cyber-button inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground neon-glow hover:brightness-110 transition"
            >
              Get a Quote
            </a>
          </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section
      id="top"
      className="overdrive-hero relative flex min-h-screen items-center justify-center overflow-hidden scanlines"
    >
      <div className="hero-grid absolute inset-0 grid-bg" />
      <div className="hero-beam absolute inset-0" />
      <div className="frame-corner frame-corner-tl" aria-hidden="true" />
      <div className="frame-corner frame-corner-tr" aria-hidden="true" />
      <div className="frame-corner frame-corner-bl" aria-hidden="true" />
      <div className="frame-corner frame-corner-br" aria-hidden="true" />

      <div className="hero-rail hero-rail-left" aria-hidden="true">REC • 24 FPS • 4K • COLOR 12BIT</div>
      <div className="hero-rail hero-rail-right" aria-hidden="true">BAYCON_UNIT // SIGNAL ACTIVE</div>

      <div className="relative z-10 max-w-6xl px-5 text-center sm:px-6">
        <div className="system-badge mb-6 inline-flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] sm:text-xs">
          <span className="signal-dot h-2 w-2 bg-primary" />
          System Initialized // Cinematic Video Editing
        </div>
        <div className="hero-index mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Frame 0001 — Cut beyond ordinary</div>
        <h1 className="mega-glitch font-display text-[clamp(4.3rem,16vw,13rem)] font-black leading-[0.78]" data-text="BAYCON">
          <span>BAYCON</span>
        </h1>
        <p className="hero-tagline mx-auto mt-8 max-w-3xl text-base font-medium text-muted-foreground sm:text-xl md:text-2xl">
          Your Story. Our Edit. <span className="text-foreground">Unforgettable.</span>
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#portfolio"
            className="cyber-button group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition"
          >
            See Our Work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="cyber-button inline-flex items-center gap-2 neon-border bg-background/40 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-primary/10 transition"
          >
            Get a Quote
          </a>
        </div>
      </div>

      <div className="hero-readout absolute bottom-8 left-6 hidden border-l-2 border-primary pl-4 text-left font-mono text-[9px] uppercase leading-5 tracking-[0.18em] md:block">
        <div className="text-primary">Latency: 12ms</div>
        <div>Status: syncing frames...</div>
      </div>
      <div className="hero-readout absolute bottom-8 right-6 hidden border-r-2 border-border pr-4 text-right font-mono text-[9px] uppercase leading-5 tracking-[0.18em] md:block">
        <div className="text-muted-foreground">Est. 2024 // Baycon Unit 01</div>
        <div>Post-production engine active</div>
      </div>
      <div className="scroll-command absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        Scroll to engage ↓
      </div>
    </section>
  );
}

function BroadcastTicker() {
  const line = "BAYCON // CUT • COLOR • MOTION • SOUND • RETENTION • REPEAT // ";
  return (
    <div className="broadcast-ticker overflow-hidden border-y border-primary bg-primary py-2 text-primary-foreground" aria-hidden="true">
      <div className="ticker-track flex w-max whitespace-nowrap font-display text-xs font-black uppercase tracking-[0.24em]">
        <span>{line.repeat(4)}</span><span>{line.repeat(4)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
const SERVICES = [
  {
    icon: "🎙️",
    title: "Talking Head Editing",
    desc: "Clean cuts, smart captions, and broadcast-grade color grading for creators, podcasters, and coaches.",
  },
  {
    icon: "🎨",
    title: "Motion Graphics",
    desc: "Animated intros, lower thirds, kinetic typography, and brand systems that bring frames to life.",
  },
  {
    icon: "🎬",
    title: "Video Editing",
    desc: "Reels, ads, YouTube videos, and brand films — high-impact edits that stop the scroll.",
  },
];

function Services() {
  return (
    <Section id="services">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Services" title="What We Edit" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:neon-glow group"
            >
              <div className="text-5xl mb-6">{s.icon}</div>
              <h3 className="text-xl font-bold text-foreground group-hover:neon-text transition">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio                                                           */
/* ------------------------------------------------------------------ */
function toEmbedUrl(raw: string): string {
  const url = raw.trim();
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      // already an embed
      if (u.pathname.startsWith("/embed/")) return url;
      // /watch?v=ID
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // /shorts/ID  or  /live/ID
      const m = u.pathname.match(/^\/(shorts|live)\/([^/?#]+)/);
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
    // TikTok: https://www.tiktok.com/@user/video/<id>
    if (host.endsWith("tiktok.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const m = u.pathname.match(/\/video\/(\d+)/);
      if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`;
    }
  } catch {
    /* fall through */
  }
  return url;
}

type PublishedWork = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  embed_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
};

type PortfolioCategory = {
  key: "Motion Graphics" | "Talking Head" | "Random Edit" | "Business Edit";
  number: string;
  title: string;
  strapline: string;
  rail: string;
  aliases: string[];
  tone: string;
};

const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    key: "Motion Graphics",
    number: "01",
    title: "Motion Graphics",
    strapline: "Kinetic type, animated systems, compositing, and visual worlds built frame by frame.",
    rail: "2D ANIMATION • KINETIC TYPE • COMPOSITING • VISUAL SYSTEMS • ",
    aliases: ["Motion Graphics"],
    tone: "motion",
  },
  {
    key: "Talking Head",
    number: "02",
    title: "Talking Head Videos",
    strapline: "Personality-first edits with sharp pacing, clean captions, and polished narrative clarity.",
    rail: "STORY • CAPTIONS • B-ROLL • RETENTION • PERSONAL BRAND • ",
    aliases: ["Talking Head", "Talking Head Videos", "Talking Head Editing"],
    tone: "talking",
  },
  {
    key: "Random Edit",
    number: "03",
    title: "Random Edit",
    strapline: "No fixed rules. Experimental cuts, unexpected rhythms, and chaos shaped with intention.",
    rail: "REMIX • RHYTHM • EXPERIMENT • CHAOS BY DESIGN • REPLAY • ",
    aliases: ["Random Edit", "General Editing", "Video Editing General"],
    tone: "random",
  },
  {
    key: "Business Edit",
    number: "04",
    title: "Business Edit",
    strapline: "Refined corporate storytelling designed to build trust, explain value, and move audiences.",
    rail: "BRAND FILM • PRODUCT • CASE STUDY • CONVERSION • BUSINESS • ",
    aliases: ["Business Edit", "Business Editing"],
    tone: "business",
  },
];

function PortfolioMedia({ item, index }: { item: PublishedWork; index: number }) {
  const [showEmbed, setShowEmbed] = useState(!item.thumbnail_url);

  return (
    <article className="portfolio-media group" style={{ "--media-index": index } as React.CSSProperties}>
      <div className="portfolio-media-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        {item.embed_url && showEmbed ? (
          <iframe
            src={toEmbedUrl(item.embed_url)}
            title={item.title}
            className="absolute inset-0 h-full w-full"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : item.embed_url && item.thumbnail_url ? (
          <button
            type="button"
            className="portfolio-thumbnail absolute inset-0 h-full w-full"
            onClick={() => setShowEmbed(true)}
            aria-label={`Play ${item.title}`}
          >
            <img src={item.thumbnail_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="portfolio-thumbnail-shade" aria-hidden="true" />
            <span className="portfolio-play" aria-hidden="true">▶</span>
            <span className="portfolio-play-label">Play video</span>
          </button>
        ) : item.video_url ? (
          <video
            src={item.video_url}
            poster={item.thumbnail_url ?? undefined}
            controls
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground" aria-label="Video preview unavailable">
            <span className="font-display text-5xl">▶</span>
          </div>
        )}
      </div>
      <div className="portfolio-media-copy">
        <span className="font-mono text-[9px] uppercase text-primary">Cut_{String(index + 1).padStart(2, "0")}</span>
        <h4 className="mt-1 truncate font-display text-base font-black uppercase text-foreground">{item.title}</h4>
        {item.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>}
      </div>
    </article>
  );
}

function PortfolioChapter({ category, works }: { category: PortfolioCategory; works: PublishedWork[] }) {
  const rail = category.rail.repeat(4);
  return (
    <section className={`portfolio-chapter portfolio-${category.tone}`} aria-labelledby={`portfolio-${category.tone}`}>
      <div className="portfolio-ghost" aria-hidden="true">{category.title}</div>
      <div className="portfolio-orbit" aria-hidden="true"><span>{category.number}</span></div>
      <div className="portfolio-chapter-head">
        <div className="portfolio-chapter-number">Chapter {category.number}</div>
        <h3 id={`portfolio-${category.tone}`} className="portfolio-chapter-title">{category.title}</h3>
        <p>{category.strapline}</p>
      </div>
      <div className="portfolio-rail" aria-hidden="true">
        <div className="portfolio-rail-track"><span>{rail}</span><span>{rail}</span></div>
      </div>
      {works.length > 0 ? (
        <div className="portfolio-media-grid">
          {works.map((item, index) => <PortfolioMedia key={item.id} item={item} index={index} />)}
        </div>
      ) : (
        <div className="portfolio-empty">
          <span className="font-mono text-[10px] uppercase text-muted-foreground">Awaiting transmission</span>
          <p className="mt-2 text-sm text-muted-foreground">New {category.title.toLowerCase()} work will appear here.</p>
        </div>
      )}
    </section>
  );
}

function Portfolio() {
  const [works, setWorks] = useState<PublishedWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("works")
      .select("id, title, category, description, embed_url, video_url, thumbnail_url")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }: { data: PublishedWork[] | null }) => {
        setWorks(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <Section id="portfolio" className="portfolio-stage bg-card/30 px-0">
      <div className="mx-auto max-w-[100rem]">
        <div className="px-6">
          <SectionHeader eyebrow="Portfolio" title="Four Worlds. One Edit Suite." />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">Explore the work by style. Every chapter moves differently because every story asks for a different rhythm.</p>
        </div>
        {loading ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">Loading works…</p>
        ) : (
          <div className="mt-20 space-y-8 md:space-y-14">
            {PORTFOLIO_CATEGORIES.map((category) => (
              <PortfolioChapter
                key={category.key}
                category={category}
                works={works.filter((work) => category.aliases.includes(work.category))}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

function MotionInterlude({ words, reverse = false }: { words: string; reverse?: boolean }) {
  const line = `${words} • ${words} • ${words} • `;
  return (
    <div className={`motion-interlude ${reverse ? "motion-interlude-reverse" : ""}`} aria-hidden="true">
      <div className="motion-interlude-track"><span>{line}</span><span>{line}</span></div>
      <div className="motion-interlude-outline">{words}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
function About() {
  return (
    <Section id="about">
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeader eyebrow="About" title="Built To Stop The Scroll" />
        <p className="mt-10 text-lg md:text-2xl leading-relaxed text-muted-foreground">
          We are <span className="text-foreground font-semibold">The Baycon Team</span> — a video
          editing brand built for creators and businesses who refuse to blend in. From talking head
          videos to jaw-dropping motion graphics, we turn raw footage into{" "}
          <span className="neon-text font-semibold">cinematic, high-impact content</span> that stops
          the scroll.
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
          Every project starts with your story. We dig into the footage, the intent, and the
          audience, then craft a cut that carries momentum from the first frame to the last.
          Whether it's a 30-second ad, a long-form YouTube documentary, or a full brand campaign,
          our edits are engineered for retention, replay value, and results.
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
          Backed by hundreds of hours behind the timeline, we blend cinematic storytelling with
          modern platform-native pacing — punchy for Reels and TikTok, patient and layered for
          YouTube and brand films.
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */
const TIERS = [
  {
    name: "Basic",
    price: 49,
    features: [
      "Up to 5 minutes edited video",
      "Basic color grading",
      "Captions / subtitles",
      "2-day delivery",
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: 120,
    features: [
      "Up to 15 minutes edited video",
      "Color grading",
      "Captions / subtitles",
      "Motion graphics intro & outro",
      "2 revisions",
      "3 day delivery",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: 250,
    features: [
      "Up to 30 minutes edited video",
      "Full motion graphics",
      "Advanced color grade",
      "Sound design",
      "Captions / subtitles",
      "Unlimited revisions",
      "Priority 7 days delivery",
    ],
    popular: false,
  },
];

function Pricing() {
  return (
    <Section id="pricing" className="bg-card/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Pricing" title="Pick Your Package" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative glass rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                tier.popular ? "neon-border neon-glow scale-[1.02]" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground neon-glow">
                  ⭐ Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-black tracking-wider text-foreground">
                {tier.name.toUpperCase()}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black neon-text">${tier.price}</span>
                <span className="text-sm text-muted-foreground">/project</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary neon-glow shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-10 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold uppercase tracking-widest transition ${
                  tier.popular
                    ? "bg-primary text-primary-foreground neon-glow hover:brightness-110"
                    : "neon-border text-foreground hover:bg-primary/10"
                }`}
              >
                Choose {tier.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */
function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project_type = String(data.get("type") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || name.length > 100) return setError("Please enter your name (max 100 chars).");
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 255) return setError("Please enter a valid email.");
    if (!project_type) return setError("Please pick a project type.");
    if (!message || message.length > 2000) return setError("Message is required (max 2000 chars).");

    setSending(true);
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({ name, email, project_type, message });
    setSending(false);

    if (insertError) {
      setError("Could not send your message. Please try again.");
      return;
    }
    setSent(true);
    form.reset();
  }

  return (
    <Section id="contact">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="Contact" title="Ready To Elevate Your Content?" />
        <p className="mt-6 text-center text-muted-foreground">
          Tell us about your project. We'll get back within 24 hours.
        </p>

        {sent ? (
          <div className="mt-12 glass rounded-2xl p-10 text-center neon-border">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-foreground">Message received</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for reaching out — we'll be in touch within 24 hours.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 inline-flex items-center justify-center rounded-md neon-border px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:bg-primary/10"
            >
              Send another
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="mt-12 glass rounded-2xl p-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" name="name" type="text" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Project Type
            </label>
            <select
              name="type"
              required
              defaultValue=""
              className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            >
              <option value="" disabled>
                Select a service…
              </option>
              <option>Talking Head</option>
              <option>Motion Graphics</option>
              <option>General Editing</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={2000}
              placeholder="Tell us about your project, length, deadline, style references…"
              className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition resize-none"
            />
          </div>
          {error && <p className="text-sm text-primary">{error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Your message goes straight to the Baycon inbox — no email app needed.
          </p>
        </form>
        )}
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#top" className="font-display text-2xl font-black tracking-widest neon-text">
          BAYCON
        </a>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a
            href="https://instagram.com/bayconedit48"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            Instagram @bayconedit48
          </a>
          <a
            href="https://tiktok.com/@bayconedit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            TikTok @bayconedit
          </a>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 Baycon. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading text-center">
      <div className="section-kicker inline-flex items-center gap-2 border border-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        <span className="signal-dot h-1.5 w-1.5 bg-primary" />
        Module // {eyebrow}
      </div>
      <h2 className="kinetic-heading mt-5 text-4xl font-black text-foreground md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "500+", label: "Videos Delivered" },
  { value: "120M+", label: "Views Generated" },
  { value: "48h", label: "Average Turnaround" },
  { value: "98%", label: "Client Retention" },
];

function Stats() {
  return (
    <Section id="stats" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-6 text-center transition hover:neon-glow"
          >
            <div className="font-display text-4xl md:text-5xl font-black neon-text">{s.value}</div>
            <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const PROCESS = [
  {
    step: "01",
    title: "Discovery Call",
    desc: "We jump on a quick call to understand your brand voice, goals, deadline, and the audience you're trying to reach. No cookie-cutter briefs.",
  },
  {
    step: "02",
    title: "Upload & Brief",
    desc: "Send us your footage, references, and any assets. We lock the creative direction, edit style, music vibe, and delivery milestones.",
  },
  {
    step: "03",
    title: "Edit & Iterate",
    desc: "Our editors build the first cut with pacing, color, sound design, and motion graphics. You review, we refine — as many revisions as your tier allows.",
  },
  {
    step: "04",
    title: "Deliver & Scale",
    desc: "Final files are delivered in every ratio you need — 16:9, 9:16, 1:1 — ready to post, run as ads, or fuel a full content calendar.",
  },
];

function Process() {
  return (
    <Section id="process" className="bg-card/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Process" title="How We Work" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div
              key={p.step}
              className="relative glass rounded-2xl p-8 transition hover:-translate-y-2 hover:neon-glow"
            >
              <div className="font-display text-5xl font-black neon-text opacity-80">{p.step}</div>
              <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const WHY = [
  {
    title: "Retention-First Editing",
    desc: "Every cut is engineered around watch-time. We remove filler, tighten pacing, and layer B-roll that keeps eyes locked to the screen.",
  },
  {
    title: "Platform Native Cuts",
    desc: "We ship vertical, square, and horizontal versions tuned for TikTok, Reels, Shorts, and long-form YouTube — no lazy re-crops.",
  },
  {
    title: "Cinematic Color & Sound",
    desc: "Broadcast-grade color grading, mastered audio, and sound design that gives even talking heads a cinematic feel.",
  },
  {
    title: "Fast, Predictable Delivery",
    desc: "Clear milestones, transparent revisions, and turnarounds you can plan a content calendar around.",
  },
  {
    title: "Own Motion Graphics",
    desc: "No stock templates. Every intro, lower third, and kinetic type sequence is designed inside your brand system.",
  },
  {
    title: "Long-Term Partnership",
    desc: "Most of our clients stay for months or years. We learn your voice, your edits get sharper, your channel compounds.",
  },
];

function WhyChooseUs() {
  return (
    <Section id="why">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Why Baycon" title="What Sets Us Apart" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div
              key={w.title}
              className="glass rounded-2xl p-8 transition hover:-translate-y-2 hover:neon-glow"
            >
              <h3 className="text-lg font-bold text-foreground">{w.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Baycon transformed my YouTube channel. Watch time doubled inside a month and the edits genuinely feel cinematic. I don't stress about post anymore.",
    name: "Jordan M.",
    role: "YouTube Creator, 480k subs",
  },
  {
    quote:
      "We handed them raw founder interviews and got back ads that outperformed our agency spend. Clean, sharp, on-brand every single time.",
    name: "Priya S.",
    role: "Head of Growth, SaaS Startup",
  },
  {
    quote:
      "The motion graphics work is on another level. Our launch video felt like a full production and it was turned around in under a week.",
    name: "Marcus L.",
    role: "Brand Director, DTC Fashion",
  },
];

function Testimonials() {
  return (
    <Section id="testimonials" className="bg-card/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Testimonials" title="What Clients Say" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="glass rounded-2xl p-8 flex flex-col transition hover:-translate-y-2 hover:neon-glow"
            >
              <div className="text-primary text-3xl leading-none">"</div>
              <blockquote className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-bold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}

const FAQS = [
  {
    q: "How fast can you turn around a project?",
    a: "Most Basic and Standard edits go out in 2–3 days. Premium projects with heavy motion graphics ship within 7 days. Rush delivery is available on request.",
  },
  {
    q: "How do I send you my footage?",
    a: "You can share via Google Drive, Dropbox, Frame.io, or WeTransfer. If files are massive, we'll set up a dedicated upload folder for you.",
  },
  {
    q: "Do you handle vertical content for TikTok and Reels?",
    a: "Absolutely. We deliver in every ratio you need — 16:9, 9:16, and 1:1 — reframed and re-paced for each platform, not lazy crops.",
  },
  {
    q: "How many revisions do I get?",
    a: "Basic includes 1 revision, Standard includes 2, and Premium is unlimited within scope. We always aim to nail it in the first pass.",
  },
  {
    q: "Do you provide music and sound effects?",
    a: "Yes. Every project includes fully licensed music, sound design, and mastered audio at no extra cost.",
  },
  {
    q: "Can we work on a monthly retainer?",
    a: "Yes — most of our creators and brands work with us on a monthly basis. Reach out and we'll build a custom plan around your volume.",
  },
];

function FAQ() {
  return (
    <Section id="faq">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="FAQ" title="Frequently Asked" />
        <div className="mt-16 space-y-4">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group glass rounded-xl p-6 transition hover:neon-glow open:neon-border"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-bold text-foreground">
                <span>{f.q}</span>
                <span className="text-primary text-2xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CtaBanner() {
  return (
    <Section id="cta" className="py-20 md:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl neon-border bg-card/40 p-12 md:p-16 text-center">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <h2 className="relative font-display text-3xl md:text-5xl font-black tracking-tight text-foreground">
          Your next viral cut is <span className="neon-text">one edit</span> away.
        </h2>
        <p className="relative mt-4 text-muted-foreground max-w-2xl mx-auto">
          Let's build a content engine that stops thumbs, earns watch-time, and turns viewers into
          customers. Slots open weekly.
        </p>
        <a
          href="#contact"
          className="relative mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition"
        >
          Start Your Project →
        </a>
      </div>
    </Section>
  );
}

function BayconHome() {
  return (
    <div className="baycon-overdrive min-h-screen overflow-clip bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <BroadcastTicker />
        <Stats />
        <MotionInterlude words="IDEAS IN MOTION" />
        <Services />
        <Process />
        <MotionInterlude words="EVERY FRAME HAS ENERGY" reverse />
        <Portfolio />
        <MotionInterlude words="CUT LOUDER" />
        <WhyChooseUs />
        <About />
        <MotionInterlude words="STORIES THAT MOVE" reverse />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
