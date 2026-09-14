import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CHALLENGES,
  SCAN_RESULTS,
  SEED_LOG,
  type LogEntry,
  type ScanResult,
} from "@/lib/eco-data";

export type Tab = "home" | "challenges" | "log" | "profile";
export type ScanPhase = "idle" | "capturing" | "analyzing" | "result";

interface EcoState {
  tab: Tab;
  setTab: (t: Tab) => void;
  phase: ScanPhase;
  scan: ScanResult | null;
  startScan: () => void;
  closeScan: () => void;
  points: number;
  co2: number;
  water: number;
  plastic: number;
  score: number;
  streak: number;
  done: string[];
  toggleChallenge: (id: string) => void;
  log: LogEntry[];
  logScan: (s: ScanResult) => void;
  scansLogged: number;
}

const EcoContext = createContext<EcoState | null>(null);

export function EcoProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>("home");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [scanIndex, setScanIndex] = useState(0);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [points, setPoints] = useState(1240);
  const [co2, setCo2] = useState(4.2);
  const [water, setWater] = useState(120);
  const [plastic, setPlastic] = useState(6);
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>(SEED_LOG);
  const [scansLogged, setScansLogged] = useState(0);

  const startScan = useCallback(() => {
    const next = SCAN_RESULTS[scanIndex % SCAN_RESULTS.length];
    setScanIndex((i) => i + 1);
    setScan(next);
    setPhase("capturing");
    window.setTimeout(() => setPhase("analyzing"), 700);
    window.setTimeout(() => setPhase("result"), 2100);
  }, [scanIndex]);

  const closeScan = useCallback(() => {
    setPhase("idle");
    setScan(null);
  }, []);

  const toggleChallenge = useCallback((id: string) => {
    const challenge = CHALLENGES.find((c) => c.id === id);
    if (!challenge) return;
    setDone((prev) => {
      const isDone = prev.includes(id);
      setPoints((p) => p + (isDone ? -challenge.points : challenge.points));
      setCo2((c) => Math.max(0, +(c + (isDone ? -0.3 : 0.3)).toFixed(1)));
      setLog((l) =>
        isDone
          ? l.filter((e) => e.label !== challenge.title)
          : [
              {
                id: Date.now(),
                label: challenge.title,
                detail: challenge.hint,
                points: challenge.points,
                time: "Just now",
              },
              ...l,
            ],
      );
      return isDone ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const logScan = useCallback((s: ScanResult) => {
    setPoints((p) => p + s.points);
    setCo2((c) => +(c + Number(s.co2)).toFixed(2));
    setWater((w) => +(w + Number(s.water)).toFixed(1));
    setPlastic((p) => (s.category === "Plastic" ? p + 1 : p));
    setScansLogged((n) => n + 1);
    setLog((l) => [
      {
        id: Date.now(),
        label: `Scanned ${s.name.toLowerCase()}`,
        detail: s.disposal,
        points: s.points,
        time: "Just now",
      },
      ...l,
    ]);
  }, []);

  const score = useMemo(
    () => Math.min(100, 78 + done.length * 3 + scansLogged * 2),
    [done.length, scansLogged],
  );

  const value: EcoState = {
    tab,
    setTab,
    phase,
    scan,
    startScan,
    closeScan,
    points,
    co2,
    water,
    plastic,
    score,
    streak: 12,
    done,
    toggleChallenge,
    log,
    logScan,
    scansLogged,
  };

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error("useEco must be used inside EcoProvider");
  return ctx;
}
