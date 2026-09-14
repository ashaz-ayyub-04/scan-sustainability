import containerImg from "@/assets/scan-container.jpg";
import bottleImg from "@/assets/scan-bottle.jpg";
import chargerImg from "@/assets/scan-charger.jpg";

export interface ScanResult {
  id: string;
  name: string;
  category: string;
  image: string;
  recyclability: number; // 0-100
  recyclabilityLabel: string;
  disposal: string;
  co2: string;
  water: string;
  thirdStat: string;
  thirdStatLabel: string;
  alternative: string;
  points: number;
}

export const SCAN_RESULTS: ScanResult[] = [
  {
    id: "container",
    name: "Plastic food container",
    category: "Plastic",
    image: containerImg,
    recyclability: 52,
    recyclabilityLabel: "Medium",
    disposal:
      "Rinse, remove the lid, and place in the dry-waste recyclables bin.",
    co2: "0.08",
    water: "2.1",
    thirdStat: "1",
    thirdStatLabel: "plastic",
    alternative: "Keep a reusable steel container",
    points: 10,
  },
  {
    id: "bottle",
    name: "PET water bottle",
    category: "Plastic",
    image: bottleImg,
    recyclability: 78,
    recyclabilityLabel: "High",
    disposal:
      "Empty, crush, and screw the cap back on. Dry-waste recyclables bin.",
    co2: "0.03",
    water: "0.5",
    thirdStat: "500 y",
    thirdStatLabel: "to decay",
    alternative: "Carry a refillable steel bottle",
    points: 10,
  },
  {
    id: "charger",
    name: "Old phone charger",
    category: "E-waste",
    image: chargerImg,
    recyclability: 24,
    recyclabilityLabel: "Low",
    disposal:
      "Never in regular garbage. Take it to an e-waste collection center.",
    co2: "0.6",
    water: "14",
    thirdStat: "1",
    thirdStatLabel: "hazard",
    alternative: "Use a universal USB-C cable",
    points: 15,
  },
];

export interface Challenge {
  id: string;
  title: string;
  hint: string;
  points: number;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "walk",
    title: "Swap a car trip under 2 km for a walk",
    hint: "Save roughly 0.3 kg CO₂ this visit",
    points: 15,
  },
  {
    id: "dry-waste",
    title: "Log one item in the dry-waste bin",
    hint: "Keep your recycling streak alive",
    points: 10,
  },
  {
    id: "scan",
    title: "Scan something you almost tossed",
    hint: "Unlock your next field badge",
    points: 10,
  },
  {
    id: "refill",
    title: "Refill instead of buying a bottle",
    hint: "Saves 1 plastic item and 0.5 L of production water",
    points: 10,
  },
  {
    id: "lights",
    title: "Switch off idle appliances for the evening",
    hint: "Trim around 0.2 kg CO₂ before bed",
    points: 5,
  },
];

export interface LogEntry {
  id: number;
  label: string;
  detail: string;
  points: number;
  time: string;
}

export const SEED_LOG: LogEntry[] = [
  {
    id: 1,
    label: "Recycled a glass jar",
    detail: "Dry-waste bin",
    points: 10,
    time: "Yesterday",
  },
  {
    id: 2,
    label: "Walked to the market",
    detail: "1.4 km instead of driving",
    points: 15,
    time: "Yesterday",
  },
  {
    id: 3,
    label: "Refilled steel bottle",
    detail: "Skipped a PET bottle",
    points: 10,
    time: "2 days ago",
  },
];

export interface Badge {
  emoji: string;
  name: string;
  unlocked: boolean;
}

export const BADGES: Badge[] = [
  { emoji: "🌱", name: "First scan", unlocked: true },
  { emoji: "🔥", name: "7-day streak", unlocked: true },
  { emoji: "♻️", name: "Recycler x10", unlocked: true },
  { emoji: "💧", name: "Water saver", unlocked: false },
  { emoji: "🏆", name: "Neighborhood top 10", unlocked: false },
];
