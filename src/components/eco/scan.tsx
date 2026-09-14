import { Check, ScanLine, X } from "lucide-react";
import { useState } from "react";
import { useEco } from "./eco-store";

export function ScanOverlay() {
  const { phase, scan, closeScan, logScan, setTab } = useEco();
  const [logged, setLogged] = useState(false);

  if (phase === "idle" || !scan) return null;

  const handleLog = () => {
    if (logged) return;
    logScan(scan);
    setLogged(true);
    window.setTimeout(() => {
      setLogged(false);
      closeScan();
      setTab("log");
    }, 900);
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      {/* Camera view */}
      <button
        onClick={closeScan}
        className="absolute top-5 right-5 z-30 size-10 rounded-full bg-cream/90 ring-1 ring-ink/10 grid place-items-center"
        aria-label="Close scanner"
      >
        <X className="size-5 text-ink" />
      </button>

      <div className="relative flex-1 bg-ink">
        <img
          src={scan.image}
          alt={scan.name}
          width={512}
          height={512}
          className="absolute inset-0 size-full object-cover opacity-90"
        />
        {/* Viewfinder frame */}
        <div className="absolute inset-x-10 top-1/2 -translate-y-[70%] aspect-square rounded-3xl border-2 border-dashed border-cream/70" />
        {(phase === "capturing" || phase === "analyzing") && (
          <div className="absolute inset-x-10 top-1/2 -translate-y-[70%] aspect-square overflow-hidden rounded-3xl">
            <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-leaf/40 to-transparent animate-eco-shimmer" />
          </div>
        )}
        {phase === "analyzing" && (
          <div className="absolute bottom-24 inset-x-0 flex justify-center">
            <div className="flex items-center gap-2 bg-ink/70 rounded-full px-4 py-2">
              <ScanLine className="size-4 text-leaf animate-pulse" />
              <span className="text-xs font-semibold text-cream">
                Identifying object…
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Result sheet */}
      {phase === "result" && (
        <div className="absolute inset-x-0 bottom-0 animate-eco-rise">
          <div className="mx-4 mb-4 bg-cream rounded-[1.75rem] ring-1 ring-ink/5 shadow-[0_-14px_40px_-16px_rgba(33,48,42,0.35)] pb-6 max-h-[70%] overflow-y-auto">
            <div className="pt-3 flex justify-center">
              <span className="h-1.5 w-10 rounded-full bg-ink/15" />
            </div>

            <div className="px-5 pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={scan.image}
                  alt={scan.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-ink/10"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-ink text-balance">
                    {scan.name}
                  </h3>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 bg-moss/10 rounded-full px-2.5 py-1">
                    <span className="size-1.5 rounded-full bg-moss shrink-0" />
                    <span className="text-xs font-semibold text-moss">
                      {scan.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recyclability meter */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-ink/60">
                    Recyclability
                  </span>
                  <span className="text-xs font-semibold text-clay">
                    {scan.recyclabilityLabel} · {scan.recyclability}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-ink/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-clay transition-all duration-700"
                    style={{ width: `${scan.recyclability}%` }}
                  />
                </div>
              </div>

              {/* Disposal */}
              <div className="mt-4 bg-sand rounded-2xl p-3.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
                  Disposal
                </p>
                <p className="text-sm text-ink mt-1 text-pretty">
                  {scan.disposal}
                </p>
              </div>

              {/* Impact numbers */}
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[
                  { v: scan.co2, l: "kg CO₂", accent: true },
                  { v: scan.water, l: "L water", accent: false },
                  { v: scan.thirdStat, l: scan.thirdStatLabel, accent: false },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="bg-cream rounded-2xl p-3 ring-1 ring-ink/5 text-center"
                  >
                    <p
                      className={`font-display text-xl font-semibold ${
                        s.accent ? "text-moss" : "text-ink"
                      }`}
                    >
                      {s.v}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/50 mt-1">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>

              {/* Greener alternative */}
              <div className="mt-3 flex items-center gap-3 bg-butter/25 rounded-2xl p-3.5">
                <span className="size-9 shrink-0 rounded-full bg-butter grid place-items-center">
                  <span className="size-2 rounded-full bg-ink" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/60">
                    Greener alternative
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    {scan.alternative}
                  </p>
                </div>
              </div>
            </div>

            {/* Log action */}
            <div className="px-5 mt-4">
              <button
                onClick={handleLog}
                className={`w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  logged
                    ? "bg-leaf text-ink"
                    : "bg-moss text-cream ring-1 ring-moss"
                }`}
              >
                {logged ? (
                  <>
                    <Check className="size-4" strokeWidth={3} />
                    <span className="text-sm font-semibold">
                      Logged · +{scan.points} points
                    </span>
                  </>
                ) : (
                  <>
                    <span className="size-2 rounded-full bg-cream/70 shrink-0" />
                    <span className="text-sm font-semibold">
                      Log action · +{scan.points} points
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
