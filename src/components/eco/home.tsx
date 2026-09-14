import { Check } from "lucide-react";
import { CHALLENGES } from "@/lib/eco-data";
import { useEco } from "./eco-store";

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative size-[112px] shrink-0 grid place-items-center">
      <svg className="size-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="11"
          className="stroke-moss/15"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          className="stroke-moss transition-all duration-700"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-display text-[40px] font-semibold leading-none text-ink">
            {score}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-moss mt-1">
            Eco score
          </p>
        </div>
      </div>
    </div>
  );
}

export function ScoreCard() {
  const { score, co2, water, plastic } = useEco();
  return (
    <section className="px-6">
      <div className="bg-sand rounded-3xl p-5 ring-1 ring-ink/5 flex items-center gap-5">
        <ScoreRing score={score} />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/70">CO₂ saved</span>
            <span className="font-display text-lg font-semibold text-moss">
              {co2} kg
            </span>
          </div>
          <div className="h-px bg-ink/10" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/70">Water</span>
            <span className="font-display text-lg font-semibold text-ink">
              {water} L
            </span>
          </div>
          <div className="h-px bg-ink/10" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/70">Plastic</span>
            <span className="font-display text-lg font-semibold text-ink">
              {plastic} items
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChallengeRow({
  id,
  index,
  title,
  hint,
  points,
}: {
  id: string;
  index: number;
  title: string;
  hint: string;
  points: number;
}) {
  const { done, toggleChallenge } = useEco();
  const isDone = done.includes(id);
  const swatches = ["bg-butter", "bg-leaf", "bg-sand ring-1 ring-ink/5"];
  return (
    <button
      onClick={() => toggleChallenge(id)}
      className={`w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] ${
        isDone
          ? "bg-moss/10 ring-1 ring-moss/30"
          : "bg-cream ring-1 ring-ink/5"
      }`}
    >
      <div
        className={`size-11 shrink-0 rounded-xl grid place-items-center ${
          isDone ? "bg-moss" : swatches[index % swatches.length]
        }`}
      >
        {isDone ? (
          <Check className="size-5 text-cream" strokeWidth={3} />
        ) : (
          <span className="font-display text-lg font-semibold text-ink/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold text-balance ${
            isDone ? "text-ink/50 line-through" : "text-ink"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-ink/55 mt-0.5">{hint}</p>
      </div>
      <span
        className={`text-xs font-semibold shrink-0 ${
          isDone ? "text-moss" : "text-clay"
        }`}
      >
        {isDone ? "Done" : `+${points}`}
      </span>
    </button>
  );
}

export function ChallengesPreview() {
  const { setTab } = useEco();
  return (
    <section className="px-6 pt-6 pb-44">
      <div className="flex items-end justify-between mb-3">
        <h2 className="font-display text-xl font-semibold text-ink text-balance">
          Today's challenges
        </h2>
        <button
          onClick={() => setTab("challenges")}
          className="text-xs font-semibold text-clay"
        >
          See all
        </button>
      </div>
      <div className="space-y-3">
        {CHALLENGES.slice(0, 3).map((c, i) => (
          <ChallengeRow
            key={c.id}
            id={c.id}
            index={i}
            title={c.title}
            hint={c.hint}
            points={c.points}
          />
        ))}
      </div>
    </section>
  );
}
