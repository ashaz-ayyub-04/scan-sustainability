import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { ClipboardList, Home, Target, User } from "lucide-react";
import { EcoProvider, useEco, type Tab } from "@/components/eco/eco-store";
import { ChallengesPreview, ScoreCard } from "@/components/eco/home";
import { ChallengesTab, LogTab, ProfileTab } from "@/components/eco/tabs";
import { ScanOverlay } from "@/components/eco/scan";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "EcoLens — Your AI Sustainability Assistant" },
      {
        name: "description",
        content:
          "Snap a photo of any object and EcoLens tells you its environmental impact, how to dispose of it, and a greener alternative. Earn eco points for sustainable actions.",
      },
      { property: "og:title", content: "EcoLens — Scan It. Know It. Save It." },
      {
        property: "og:description",
        content:
          "Point your camera at anything and read the planet's fine print: recyclability, carbon footprint, disposal guide, and eco points.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EcoLens,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function HomeTab() {
  const { streak, name } = useEco();
  return (
    <div>
      <header className="px-6 pt-7 pb-4 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-moss">
            EcoLens
          </p>
          <h1 className="font-display text-[27px] leading-[1.05] font-semibold text-ink mt-1 text-balance">
            {greeting()}, {name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-sand rounded-full px-3 py-2">
          <span className="size-2 rounded-full bg-ember shrink-0" />
          <span className="text-sm font-semibold">{streak}</span>
          <span className="text-sm text-clay">day streak</span>
        </div>
      </header>
      <ScoreCard />
      <ChallengesPreview />
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "challenges", label: "Challenges", icon: Target },
  { id: "log", label: "Log", icon: ClipboardList },
  { id: "profile", label: "Profile", icon: User },
];

function Shell() {
  const { tab, setTab, startScan, phase } = useEco();
  const scanning = phase !== "idle";

  return (
    <div className="min-h-screen w-full bg-cream font-body text-ink flex justify-center sm:p-6">
      <div className="relative w-full sm:max-w-[390px] sm:h-[820px] sm:rounded-[2rem] overflow-hidden bg-cream sm:ring-1 sm:ring-ink/10 sm:shadow-[0_30px_60px_-30px_rgba(33,48,42,0.4)]">
        <main className="h-full overflow-y-auto">
          {tab === "home" && <HomeTab />}
          {tab === "challenges" && <ChallengesTab />}
          {tab === "log" && <LogTab />}
          {tab === "profile" && <ProfileTab />}
        </main>

        {/* Floating lens CTA */}
        {!scanning && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[96px] z-10">
            <button
              onClick={startScan}
              aria-label="Scan an object"
              className="relative grid place-items-center group"
            >
              <span className="size-[104px] rounded-full bg-ember ring-4 ring-cream absolute transition-transform group-active:scale-95" />
              <span className="relative z-10 size-16 rounded-full bg-cream grid place-items-center ring-1 ring-ink/10">
                <span className="size-2.5 rounded-full bg-ink" />
              </span>
            </button>
            <p className="text-center text-xs font-semibold text-ink mt-2">
              Tap to scan
            </p>
          </div>
        )}

        {/* Bottom tabs */}
        <nav className="absolute bottom-0 inset-x-0 z-10 bg-cream/95 backdrop-blur border-t border-ink/10 px-6 pt-3 pb-5 flex items-center justify-between">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex flex-col items-center gap-1 ${
                  active ? "text-ink" : "text-ink/40"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </nav>

        <ScanOverlay />
      </div>
    </div>
  );
}

function EcoLens() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  return (
    <EcoProvider userId={user.id} email={user.email ?? ""}>
      <Shell />
    </EcoProvider>
  );
}
