import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CHALLENGES,
  SCAN_RESULTS,
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
  name: string;
  email: string;
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

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

interface ProfileRow {
  display_name: string | null;
  avatar_url: string | null;
  points: number;
  streak: number;
  co2_saved: number;
  water_saved: number;
  plastic_avoided: number;
}

interface ScanRow {
  id: string;
  title: string;
  category: string;
  points: number;
  created_at: string;
}

export function EcoProvider({
  userId,
  email,
  children,
}: {
  userId: string;
  email: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [scanIndex, setScanIndex] = useState(0);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [name, setName] = useState("Explorer");
  const [points, setPoints] = useState(0);
  const [co2, setCo2] = useState(0);
  const [water, setWater] = useState(0);
  const [plastic, setPlastic] = useState(0);
  const [streak, setStreak] = useState(1);
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  // Load this person's saved data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [profileRes, scansRes, completionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
          .from("scan_logs")
          .select("id, title, category, points, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("challenge_completions")
          .select("challenge_id")
          .eq("user_id", userId),
      ]);
      if (cancelled) return;

      const p = profileRes.data as ProfileRow | null;
      if (p) {
        setName(p.display_name || "Explorer");
        setPoints(p.points);
        setCo2(Number(p.co2_saved));
        setWater(Number(p.water_saved));
        setPlastic(Number(p.plastic_avoided));
        setStreak(p.streak || 1);
      }
      const rows = (scansRes.data ?? []) as ScanRow[];
      setLog(
        rows.map((r) => ({
          id: r.id,
          label: `Scanned ${r.title.toLowerCase()}`,
          detail:
            SCAN_RESULTS.find((s) => s.name === r.title)?.disposal ?? r.category,
          points: r.points,
          time: timeAgo(r.created_at),
        })),
      );
      setScanIndex(rows.length);
      setDone(
        ((completionsRes.data ?? []) as { challenge_id: string }[]).map(
          (c) => c.challenge_id,
        ),
      );
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const saveProfile = useCallback(
    (patch: Partial<ProfileRow>) => {
      void supabase
        .from("profiles")
        .update(patch)
        .eq("id", userId)
        .then(({ error }) => {
          if (error) console.error("profile save failed", error);
        });
    },
    [userId],
  );

  const startScan = useCallback(() => {
    const next = SCAN_RESULTS[scanIndex % SCAN_RESULTS.length]!;
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

  const toggleChallenge = useCallback(
    (id: string) => {
      const challenge = CHALLENGES.find((c) => c.id === id);
      if (!challenge) return;
      const isDone = done.includes(id);
      const nextPoints = points + (isDone ? -challenge.points : challenge.points);
      const nextCo2 = Math.max(0, +(co2 + (isDone ? -0.3 : 0.3)).toFixed(1));

      setDone(isDone ? done.filter((x) => x !== id) : [...done, id]);
      setPoints(nextPoints);
      setCo2(nextCo2);
      setLog((l) =>
        isDone
          ? l.filter((e) => e.label !== challenge.title)
          : [
              {
                id: `c-${id}`,
                label: challenge.title,
                detail: challenge.hint,
                points: challenge.points,
                time: "Just now",
              },
              ...l,
            ],
      );

      saveProfile({ points: nextPoints, co2_saved: nextCo2 });
      if (isDone) {
        void supabase
          .from("challenge_completions")
          .delete()
          .eq("user_id", userId)
          .eq("challenge_id", id);
      } else {
        void supabase
          .from("challenge_completions")
          .insert({ user_id: userId, challenge_id: id });
      }
    },
    [done, points, co2, userId, saveProfile],
  );

  const logScan = useCallback(
    (s: ScanResult) => {
      const nextPoints = points + s.points;
      const nextCo2 = +(co2 + Number(s.co2)).toFixed(2);
      const nextWater = +(water + Number(s.water)).toFixed(1);
      const nextPlastic = s.category === "Plastic" ? plastic + 1 : plastic;

      setPoints(nextPoints);
      setCo2(nextCo2);
      setWater(nextWater);
      setPlastic(nextPlastic);
      setLog((l) => [
        {
          id: `s-${Date.now()}`,
          label: `Scanned ${s.name.toLowerCase()}`,
          detail: s.disposal,
          points: s.points,
          time: "Just now",
        },
        ...l,
      ]);

      saveProfile({
        points: nextPoints,
        co2_saved: nextCo2,
        water_saved: nextWater,
        plastic_avoided: nextPlastic,
      });
      void supabase.from("scan_logs").insert({
        user_id: userId,
        result_key: s.name,
        title: s.name,
        category: s.category,
        points: s.points,
      });
    },
    [points, co2, water, plastic, userId, saveProfile],
  );

  const scansLogged = useMemo(
    () => log.filter((e) => e.label.startsWith("Scanned")).length,
    [log],
  );

  const score = useMemo(
    () => Math.min(100, 30 + done.length * 4 + scansLogged * 2),
    [done.length, scansLogged],
  );

  const value: EcoState = {
    tab,
    setTab,
    phase,
    scan,
    startScan,
    closeScan,
    name,
    email,
    points,
    co2,
    water,
    plastic,
    score,
    streak,
    done,
    toggleChallenge,
    log,
    logScan,
    scansLogged,
  };

  if (!ready) {
    return (
      <div className="min-h-screen w-full bg-cream grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="size-14 rounded-full bg-leaf/40 grid place-items-center animate-eco-pop">
            <Leaf className="size-7 text-moss" />
          </span>
          <p className="text-sm font-semibold text-ink/60">
            Loading your field notes…
          </p>
        </div>
      </div>
    );
  }

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error("useEco must be used inside EcoProvider");
  return ctx;
}
