import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(50),
  code: z.string().min(6, "Code must be at least 6 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({
      username: form.get("username"),
      code: form.get("code"),
    });
    
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    
    setLoading(true);
    // Behind the scenes, we convert the username to an email so the database stays secure!
    const email = `${parsed.data.username.toLowerCase()}@bayconmotion.local`;
    const password = parsed.data.code;

    try {
      // 1. Try to sign in first
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      
      // 2. If it fails, the account might not exist, so let's create it automatically!
      if (error) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        
        // Wait a brief moment to let Supabase log them in
        await new Promise(r => setTimeout(r, 500));
        await supabase.auth.signInWithPassword({ email, password });
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate({ to: "/admin" });
      } else {
        toast.error("Please check the code and try again.");
      }
    } catch (err) {
      toast.error("Access Denied");
    } finally {
      setLoading(false);
    }
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