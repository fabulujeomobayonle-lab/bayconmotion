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
    <section id={id} ref={ref} className={`relative px-6 py-24 md:py-32 ${className}`}>
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
    { href: "#portfolio", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#pricing", label: "Pricing" },
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-xl font-black tracking-widest neon-text">
          BAYCON
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">
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
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground neon-glow hover:brightness-110 transition"
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden scanlines"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* glow blobs */}
      <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 mb-8 rounded-full neon-border px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground flicker">
          <span className="h-1.5 w-1.5 rounded-full bg-primary neon-glow" />
          Cinematic Video Editing
        </div>
        <h1 className="glitch font-display text-6xl sm:text-8xl md:text-[10rem] font-black leading-none tracking-tight">
          BAYCON
        </h1>
        <p className="mt-8 text-lg md:text-2xl text-muted-foreground font-medium">
          Your Story. Our Edit. <span className="text-foreground">Unforgettable.</span>
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#portfolio"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition"
          >
            See Our Work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md neon-border bg-background/40 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-primary/10 transition"
          >
            Get a Quote
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        Scroll ↓
      </div>
    </section>
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
type PublishedWork = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  embed_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
};

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
    <Section id="portfolio" className="bg-card/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Portfolio" title="Recent Cuts" />
        {loading ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">Loading works…</p>
        ) : works.length === 0 ? (
          <div className="mt-16 rounded-2xl neon-border bg-background/40 p-12 text-center">
            <p className="text-muted-foreground">No published works yet. <a href="/admin" className="text-primary hover:underline">Sign in to upload</a>.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {works.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl neon-border bg-black overflow-hidden transition-all duration-300 hover:neon-glow"
              >
                <div className="absolute top-3 left-3 z-10 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  {item.category}
                </div>
                <div className="relative w-full aspect-video bg-black">
                  {item.embed_url ? (
                    <iframe
                      src={item.embed_url}
                      title={item.title}
                      className="absolute inset-0 h-full w-full"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
                      <span className="text-3xl">▶</span>
                    </div>
                  )}
                </div>
                {(item.title || item.description) && (
                  <div className="p-4">
                    <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                    {item.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
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
      "3-day delivery",
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
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const type = String(data.get("type") || "");
    const message = String(data.get("message") || "");

    const subject = encodeURIComponent(`New Project Inquiry — ${type} — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${type}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:fabulujeomobayonle@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <Section id="contact">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="Contact" title="Ready To Elevate Your Content?" />
        <p className="mt-6 text-center text-muted-foreground">
          Tell us about your project. We'll get back within 24 hours.
        </p>

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
              placeholder="Tell us about your project, length, deadline, style references…"
              className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition"
          >
            {sent ? "Opening Your Email…" : "Send Message"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Or email us directly:{" "}
            <a href="mailto:fabulujeomobayonle@gmail.com" className="text-primary hover:underline">
              fabulujeomobayonle@gmail.com
            </a>
          </p>
        </form>
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
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full neon-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-1 w-1 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function BayconHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
