import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Baycon CMS" },
      { name: "description", content: "Secure admin access." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

// ─── Your admin credentials (change these to whatever you want) ───
const ADMIN_USERNAME = "baycon";
const ADMIN_CODE = "baycon2025";
// ──────────────────────────────────────────────────────────────────

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem("baycon_admin") === "authenticated";
}

export function adminLogout() {
  localStorage.removeItem("baycon_admin");
}

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate({ to: "/admin" });
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = (form.get("username") as string ?? "").trim().toLowerCase();
    const code = (form.get("code") as string ?? "").trim();

    if (!username || !code) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);

    // Small delay to feel like it's checking
    await new Promise((r) => setTimeout(r, 600));

    if (username === ADMIN_USERNAME && code === ADMIN_CODE) {
      localStorage.setItem("baycon_admin", "authenticated");
      toast.success("Welcome back, admin!");
      navigate({ to: "/admin" });
    } else {
      toast.error("Access Denied — invalid credentials");
    }

    setLoading(false);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <input
            name="code"
            type="password"
            required
            placeholder="Secret Code"
            className="w-full rounded-md bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 transition disabled:opacity-60 mt-4"
          >
            {loading ? "Authenticating..." : "Enter Admin Area"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}