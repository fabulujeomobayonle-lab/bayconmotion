import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Baycon CMS" },
      { name: "description", content: "Sign in to the Baycon admin to upload and manage your video portfolio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = credSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 scanlines">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md glass neon-border rounded-2xl p-8">
        <Link to="/" className="block text-center font-display text-3xl font-black tracking-widest neon-text mb-2">
          BAYCON
        </Link>
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Admin Console
        </p>

        <div className="flex rounded-md neon-border overflow-hidden mb-6 text-xs uppercase tracking-widest">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 font-bold transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-md neon-border bg-background/60 px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/10 transition disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          The first account you create automatically becomes an admin.
        </p>
      </div>
    </div>
  );
}