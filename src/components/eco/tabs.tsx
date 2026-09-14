import {
  Droplets,
  Flame,
  Leaf,
  Recycle,
  Sprout,
  Trophy,
} from "lucide-react";
import { BADGES, CHALLENGES } from "@/lib/eco-data";
import { useEco } from "./eco-store";
import { ChallengeRow } from "./home";

const BADGE_ICONS = {
  sprout: Sprout,
  flame: Flame,
  recycle: Recycle,
  droplets: Droplets,
  trophy: Trophy,
} as const;

export function ChallengesTab() {
  const { done, points } = useEco();
  return (
    <div className="pb-56">
      <header className="px-6 pt-7 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-moss">
          Missions
        </p>
        <h1 className="font-display text-[27px] leading-[1.05] font-semibold text-ink mt-1">
          Today's challenges
        </h1>
        <p className="text-sm text-ink/55 mt-1">
          {done.length} of {CHALLENGES.length} done ·{" "}
          {points.toLocaleString()} pts total
        </p>
      </header>
      <section className="px-6 space-y-3">
        {CHALLENGES.map((c, i) => (
          <ChallengeRow
            key={c.id}
            id={c.id}
            index={i}
            title={c.title}
            hint={c.hint}
            points={c.points}
          />
        ))}
      </section>
      <section className="px-6 pt-6">
        <div className="bg-sand rounded-3xl p-5 ring-1 ring-ink/5 flex items-center gap-4">
          <span className="size-12 rounded-2xl bg-butter grid place-items-center">
            <Trophy className="size-6 text-ink/80" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Weekly goal</p>
            <p className="text-xs text-ink/55 mt-0.5">
              Finish all 5 challenges to earn the Field badge
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function LogTab() {
  const { log } = useEco();
  return (
    <div className="pb-56">
      <header className="px-6 pt-7 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-moss">
          Field log
        </p>
        <h1 className="font-display text-[27px] leading-[1.05] font-semibold text-ink mt-1">
          Your actions
        </h1>
      </header>
      <section className="px-6 space-y-3">
        {log.length === 0 && (
          <div className="bg-sand rounded-3xl p-6 ring-1 ring-ink/5 text-center">
            <Leaf className="size-6 text-moss mx-auto" />
            <p className="text-sm text-ink/60 mt-2">
              Nothing logged yet. Scan something to get started.
            </p>
          </div>
        )}
        {log.map((entry) => (
          <div
            key={entry.id}
            className="bg-cream rounded-2xl p-4 ring-1 ring-ink/5 flex items-center gap-3"
          >
            <span className="size-11 shrink-0 rounded-xl bg-leaf/40 grid place-items-center">
              <Leaf className="size-5 text-moss" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink text-balance">
                {entry.label}
              </p>
              <p className="text-xs text-ink/55 mt-0.5 line-clamp-1">
                {entry.detail}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-clay">
                +{entry.points}
              </p>
              <p className="text-[10px] text-ink/40 mt-0.5">{entry.time}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export function ProfileTab() {
  const { points, streak, co2, water, plastic, score } = useEco();
  return (
    <div className="pb-56">
      <header className="px-6 pt-7 pb-4 flex items-center gap-4">
        <div className="size-14 rounded-full bg-moss grid place-items-center">
          <span className="font-display text-xl font-semibold text-cream">
            F
          </span>
        </div>
        <div>
          <h1 className="font-display text-[27px] leading-[1.05] font-semibold text-ink">
            Fern Ashby
          </h1>
          <p className="text-sm text-ink/55 mt-0.5">
            {points.toLocaleString()} pts · Level 4 Forager
          </p>
        </div>
      </header>

      <section className="px-6 grid grid-cols-2 gap-3">
        {[
          { label: "Eco score", value: `${score}/100` },
          { label: "Day streak", value: `${streak}` },
          { label: "CO₂ saved", value: `${co2} kg` },
          { label: "Water saved", value: `${water} L` },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-sand rounded-2xl p-4 ring-1 ring-ink/5"
          >
            <p className="font-display text-2xl font-semibold text-ink">
              {s.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="px-6 pt-6">
        <h2 className="font-display text-xl font-semibold text-ink mb-3">
          Badges
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const Icon = BADGE_ICONS[b.id];
            return (
              <div
                key={b.name}
                className={`rounded-2xl p-4 text-center ring-1 ${
                  b.unlocked
                    ? "bg-cream ring-ink/5"
                    : "bg-sand/60 ring-ink/5 opacity-50"
                }`}
              >
                <Icon className="size-6 text-moss mx-auto" />
                <p className="text-[11px] font-semibold text-ink mt-1.5 leading-tight">
                  {b.name}
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/40 mt-1">
                  {b.unlocked ? "Unlocked" : "Locked"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 pt-6">
        <div className="bg-moss rounded-3xl p-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/70">
            Community
          </p>
          <p className="font-display text-xl font-semibold text-cream mt-1 text-balance">
            Your neighborhood saved 50,000 L of water this month
          </p>
          <p className="text-xs text-cream/70 mt-1.5">
            You contributed {water} L — top 18% of savers
          </p>
        </div>
      </section>
      <p className="hidden">{plastic}</p>
    </div>
  );
}
