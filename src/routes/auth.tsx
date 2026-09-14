import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — EcoLens" },
      {
        name: "description",
        content:
          "Sign in to EcoLens with Google or email to track your personal eco score, scans, and challenges.",
      },
      { property: "og:title", content: "Sign in — EcoLens" },
      {
        property: "og:description",
        content:
          "Your personal sustainability companion. Sign in to keep your eco score, field log, and streaks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/" });
  },
  component: AuthPage,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "in") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        navigate({ to: "/" });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() || undefined },
            emailRedirectTo: window.location.origin,
          },
        });
        if (err) throw err;
        if (!data.session) {
          setConfirmEmail(true);
        } else {
          navigate({ to: "/" });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return; // browser is navigating to Google
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full bg-cream font-body text-ink flex justify-center sm:p-6">
      <div className="relative w-full sm:max-w-[390px] sm:rounded-[2rem] overflow-hidden bg-cream sm:ring-1 sm:ring-ink/10 sm:shadow-[0_30px_60px_-30px_rgba(33,48,42,0.4)] flex flex-col">
        <header className="px-6 pt-10 pb-2 text-center">
          <span className="size-16 rounded-full bg-leaf/40 grid place-items-center mx-auto">
            <Leaf className="size-8 text-moss" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-moss mt-4">
            EcoLens
          </p>
          <h1 className="font-display text-[30px] leading-[1.05] font-semibold mt-1 text-balance">
            Scan it. Know it. Save it.
          </h1>
          <p className="text-sm text-ink/55 mt-2">
            Your personal eco score, field log, and streaks — saved to your
            account.
          </p>
        </header>

        <main className="px-6 pt-6 pb-10 flex-1">
          {confirmEmail ? (
            <div className="bg-sand rounded-3xl p-6 ring-1 ring-ink/5 text-center">
              <MailCheck className="size-8 text-moss mx-auto" />
              <h2 className="font-display text-xl font-semibold mt-3">
                Check your inbox
              </h2>
              <p className="text-sm text-ink/60 mt-2">
                We sent a confirmation link to{" "}
                <span className="font-semibold text-ink">{email}</span>. Click
                it, then come back and sign in.
              </p>
              <button
                onClick={() => {
                  setConfirmEmail(false);
                  setMode("in");
                }}
                className="mt-5 w-full rounded-full bg-moss text-cream font-semibold text-sm py-3"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={signInWithGoogle}
                disabled={busy}
                className="w-full rounded-full bg-cream ring-1 ring-ink/15 font-semibold text-sm py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                <GoogleMark />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-ink/10" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/40">
                  or with email
                </span>
                <span className="h-px flex-1 bg-ink/10" />
              </div>

              <div className="grid grid-cols-2 bg-sand rounded-full p-1 ring-1 ring-ink/5 mb-5">
                {(
                  [
                    ["in", "Sign in"],
                    ["up", "Create account"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                      mode === m ? "bg-cream shadow-sm" : "text-ink/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-3">
                {mode === "up" && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-2xl bg-sand ring-1 ring-ink/5 px-4 py-3.5 text-sm outline-none placeholder:text-ink/40 focus:ring-moss/50"
                  />
                )}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full rounded-2xl bg-sand ring-1 ring-ink/5 px-4 py-3.5 text-sm outline-none placeholder:text-ink/40 focus:ring-moss/50"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (6+ characters)"
                  autoComplete={mode === "in" ? "current-password" : "new-password"}
                  className="w-full rounded-2xl bg-sand ring-1 ring-ink/5 px-4 py-3.5 text-sm outline-none placeholder:text-ink/40 focus:ring-moss/50"
                />

                {error && (
                  <p className="text-sm font-medium text-ember bg-ember/10 rounded-2xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ember text-cream font-semibold text-sm py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  {mode === "in" ? "Sign in" : "Create my account"}
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
