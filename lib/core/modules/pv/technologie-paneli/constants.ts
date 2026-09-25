/**
 * Dane technologii paneli 1:1 ze źródła. Gdzie źródło nie podaje liczby — `null`, nigdy
 * zgadywane (15.7). Źródło podaje sprawności jako przybliżenia ("~20%", "23%+", "19–22%") —
 * przechowywane jako [min, max], `max: null` = przedział otwarty w górę ("23%+").
 */

/** Natężenie promieniowania w warunkach STC [W/m²] — definicja mocy znamionowej (kWp) panelu. */
export const NATEZENIE_STC_W_M2 = 1000

export type Sprawnosc = { minPct: number; maxPct: number | null }

export type TechnologiaKrystaliczna = {
  id: "perc" | "half-cut" | "topcon" | "hjt"
  nazwa: string
  /** Na czym polega technologia (§3.28). */
  opis: string
  sprawnosc: Sprawnosc
  /** Degradacja roczna [%/rok] (§3.28 — podana tylko dla PERC i TOPCon). */
  degradacjaRocznaPct: number | null
  /** LID — opis z tabeli §3.29 ("do 3%", "<1%"); `null` = źródło nie podaje. */
  lidOpis: string | null
  /** Podatność na PID — opis z tabeli §3.29; `null` = źródło nie podaje. */
  pidOpis: string | null
  /** Uzysk roczny względem PERC [%] — §3.30. 🔎 dane źródła, nie wynik obliczenia (patrz memory.md 25.09.2026). */
  uzyskWzgledemPercOpis: string
}

export const TECHNOLOGIE_KRYSTALICZNE: TechnologiaKrystaliczna[] = [
  {
    id: "perc",
    nazwa: "PERC",
    opis: "Dodatkowa warstwa odbijająca na spodzie ogniwa — wyższa sprawność niż starsze ogniwa.",
    sprawnosc: { minPct: 20, maxPct: 20 },
    degradacjaRocznaPct: 0.5,
    lidOpis: "do 3%",
    pidOpis: "umiarkowane",
    uzyskWzgledemPercOpis: "100% (wzorzec)",
  },
  {
    id: "half-cut",
    nazwa: "Half-Cut",
    opis: "Ogniwa przecięte na pół — mniejsze straty i lepsza praca przy częściowym zacienieniu.",
    sprawnosc: { minPct: 21, maxPct: 21 },
    degradacjaRocznaPct: null,
    lidOpis: null,
    pidOpis: null,
    uzyskWzgledemPercOpis: "+2–3%",
  },
  {
    id: "topcon",
    nazwa: "TOPCon",
    opis: "Technologia N-type — wyższa sprawność i niska degradacja.",
    sprawnosc: { minPct: 22, maxPct: 22 },
    degradacjaRocznaPct: 0.4,
    lidOpis: "<1%",
    pidOpis: "niskie",
    uzyskWzgledemPercOpis: "+5–8%",
  },
  {
    id: "hjt",
    nazwa: "HJT",
    opis: "Heterozłącza — bardzo wysoka sprawność; źródło: bardziej odporne na LID/LETID niż PERC.",
    sprawnosc: { minPct: 23, maxPct: null },
    degradacjaRocznaPct: null,
    lidOpis: null,
    pidOpis: null,
    uzyskWzgledemPercOpis: "+8–12%",
  },
]

export type GrupaTechnologii = {
  id: "krystaliczne" | "cienkowarstwowe"
  nazwa: string
  sprawnosc: Sprawnosc
  zalety: string
  zastosowanie: string
}

/** §3.43 — krystaliczne vs cienkowarstwowe (amorficzne, CIGS, CdTe). */
export const GRUPY_TECHNOLOGII: GrupaTechnologii[] = [
  {
    id: "krystaliczne",
    nazwa: "Krystaliczne (mono, poli)",
    sprawnosc: { minPct: 19, maxPct: 22 },
    zalety: "Wyższa sprawność — mniejsza powierzchnia na tę samą moc.",
    zastosowanie: "Dach i typowa instalacja off-grid.",
  },
  {
    id: "cienkowarstwowe",
    nazwa: "Cienkowarstwowe (amorficzne, CIGS, CdTe)",
    sprawnosc: { minPct: 12, maxPct: 15 },
    zalety: "Lepsza praca przy słabym świetle, lepiej znoszą cień i upał.",
    zastosowanie: "Duża, równa powierzchnia gruntu.",
  },
]
