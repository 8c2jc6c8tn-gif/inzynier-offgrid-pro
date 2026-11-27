/**
 * Project quantities — the numbers of ONE installation that many screens need (audit `docs/audyt-powiazan-ekranow-2026-11-09.md`,
 * section 4). A screen field is linked to a quantity only when it means exactly the same thing in the same unit (a field that
 * means something else — the usable vs. the nominal capacity, Ah vs. kWh — gets its own quantity or no link at all; nothing is
 * converted or guessed). A value comes into the project only when the user saves it there (the quiet bar, `PasekProjektu`);
 * typing on a screen is analysis and never changes the project by itself.
 *
 * Amounts of money are deliberately not quantities: they carry a currency (`use-persisted-draft.ts`), and a project price is a
 * purchase fact of one offer, not a design value shared by screens.
 */

export const GRUPY_WIELKOSCI = ["lokalizacja", "zapotrzebowanie", "magazyn", "pv", "falownik", "okablowanie", "agregat", "cieplo"] as const
export type GrupaWielkosci = (typeof GRUPY_WIELKOSCI)[number]

export type DefinicjaWielkosci = {
  grupa: GrupaWielkosci
  /** Unit shown next to the value (plain symbol, the same in every language). */
  jednostka: string
  /** Key of the name in `lib/i18n/ui/projekt.ts`. */
  etykieta: string
  /** Allowed range — a value outside it is not offered for saving (it is a typo, not a design value). */
  min?: number
  max?: number
}

const d = (grupa: GrupaWielkosci, jednostka: string, etykieta: string, min?: number, max?: number): DefinicjaWielkosci => ({
  grupa,
  jednostka,
  etykieta,
  min,
  max,
})

export const WIELKOSCI = {
  szerokoscGeoDeg: d("lokalizacja", "°", "UI-WLK-SZEROKOSC", -90, 90),
  dlugoscGeoDeg: d("lokalizacja", "°", "UI-WLK-DLUGOSC", -180, 180),
  temperaturaMinC: d("lokalizacja", "°C", "UI-WLK-TEMPERATURA-MIN", -70, 30),
  /** Wind zone of the site per PN-EN 1991-1-4 Polish national annex (1–3), as chosen on the structure screens. */
  strefaWiatrowa: d("lokalizacja", "", "UI-WLK-STREFA-WIATROWA", 1, 3),
  wysokoscNpmM: d("lokalizacja", "m", "UI-WLK-WYSOKOSC-NPM", -500, 9000),

  liczbaOsob: d("zapotrzebowanie", "", "UI-WLK-LICZBA-OSOB", 0),
  zapotrzebowanieDoboweKwh: d("zapotrzebowanie", "kWh", "UI-WLK-ZAPOTRZEBOWANIE-DOBOWE", 0),
  dniAutonomii: d("zapotrzebowanie", "", "UI-WLK-DNI-AUTONOMII", 0),
  /** Daily use in winter frost [kWh/day] — higher than the year-round daily demand; owner decision 25.11.2026. */
  zuzycieZimoweKwh: d("zapotrzebowanie", "kWh", "UI-WLK-ZUZYCIE-ZIMOWE", 0),

  napiecieUkladuV: d("magazyn", "V", "UI-WLK-NAPIECIE-UKLADU", 0),
  pojemnoscUzytecznaKwh: d("magazyn", "kWh", "UI-WLK-POJEMNOSC-UZYTECZNA", 0),
  pojemnoscNominalnaKwh: d("magazyn", "kWh", "UI-WLK-POJEMNOSC-NOMINALNA", 0),
  pojemnoscNominalnaAh: d("magazyn", "Ah", "UI-WLK-POJEMNOSC-AH", 0),
  dodPct: d("magazyn", "%", "UI-WLK-DOD", 0, 100),
  /** The lowest state of charge the system may reach (BMS/inverter cut-off or the user's reserve) [%]. */
  socMinPct: d("magazyn", "%", "UI-WLK-SOC-MIN", 0, 100),
  pojemnoscZBuforemKwh: d("magazyn", "kWh", "UI-WLK-POJEMNOSC-Z-BUFOREM", 0),
  /** Internal resistance of the whole battery bank [Ω] (datasheet / measurement) — sets the short-circuit current. */
  rezystancjaWewnMagazynuOhm: d("magazyn", "Ω", "UI-WLK-REZYSTANCJA-MAGAZYNU", 0),

  mocPaneluWp: d("pv", "Wp", "UI-WLK-MOC-PANELU", 0),
  vocStcV: d("pv", "V", "UI-WLK-VOC", 0),
  iscStcA: d("pv", "A", "UI-WLK-ISC", 0),
  vmpStcV: d("pv", "V", "UI-WLK-VMP", 0),
  impStcA: d("pv", "A", "UI-WLK-IMP", 0),
  betaVocPctNaC: d("pv", "%/°C", "UI-WLK-BETA-VOC", -2, 2),
  gammaPmaxPctNaC: d("pv", "%/°C", "UI-WLK-GAMMA-PMAX", -2, 2),
  liczbaPaneli: d("pv", "", "UI-WLK-LICZBA-PANELI", 0),
  liczbaPaneliWStringu: d("pv", "", "UI-WLK-PANELE-W-STRINGU", 0),
  liczbaStringowRownoleglych: d("pv", "", "UI-WLK-STRINGI-ROWNOLEGLE", 0),
  mocPvKwp: d("pv", "kWp", "UI-WLK-MOC-PV", 0),
  nachylenieDeg: d("pv", "°", "UI-WLK-NACHYLENIE", 0, 90),
  /** Direction the panels face, the app's single convention: N = 0, E = 90, S = 180, W = 270 (PVGIS fields with S = 0 are not linked). */
  azymutDeg: d("pv", "°", "UI-WLK-AZYMUT", 0, 360),

  mocFalownikaW: d("falownik", "W", "UI-WLK-MOC-FALOWNIKA", 0),
  sprawnoscFalownikaPct: d("falownik", "%", "UI-WLK-SPRAWNOSC-FALOWNIKA", 0, 100),

  pradGlownyDcA: d("okablowanie", "A", "UI-WLK-PRAD-GLOWNY-DC", 0),
  przekrojGlownyDcMm2: d("okablowanie", "mm²", "UI-WLK-PRZEKROJ-GLOWNY-DC", 0),
  dlugoscGlownyDcM: d("okablowanie", "m", "UI-WLK-DLUGOSC-GLOWNY-DC", 0),
  /** Prospective short-circuit current of the battery bank [A] — the „Analiza zwarciowa” result, read by the protection screens. */
  pradZwarciowyMagazynuA: d("okablowanie", "A", "UI-WLK-PRAD-ZWARCIOWY-MAGAZYNU", 0),

  mocAgregatuKw: d("agregat", "kW", "UI-WLK-MOC-AGREGATU", 0),
  zuzyciePaliwaLH: d("agregat", "l/h", "UI-WLK-ZUZYCIE-PALIWA", 0),
  /** Fuel use at 80% load [l/h] — the working point of a battery-charging generator (owner decision 26.11.2026). */
  zuzyciePaliwa80LH: d("agregat", "l/h", "UI-WLK-ZUZYCIE-PALIWA-80", 0),

  mocGrzewczaKw: d("cieplo", "kW", "UI-WLK-MOC-GRZEWCZA", 0),
  zapotrzebowanieCieplaRokKwh: d("cieplo", "kWh", "UI-WLK-CIEPLO-ROK", 0),
} as const satisfies Record<string, DefinicjaWielkosci>

export type WielkoscId = keyof typeof WIELKOSCI
export const ID_WIELKOSCI = Object.keys(WIELKOSCI) as WielkoscId[]

export function czyWielkosc(x: unknown): x is WielkoscId {
  return typeof x === "string" && Object.hasOwn(WIELKOSCI, x)
}

/** A stored project value: the number as text (dot decimal), the screen it came from and when. */
export type WartoscProjektu = { v: string; zrodlo: string; iso: string }
export type WartosciProjektu = Partial<Record<WielkoscId, WartoscProjektu>>

/** Text of a field → canonical number text (`"2,5"` → `"2.5"`); `null` when it is not a finite number. */
export function normalizujLiczbe(tekst: string | number): string | null {
  if (typeof tekst === "number") return Number.isFinite(tekst) ? String(tekst) : null
  const t = tekst.trim().replace(",", ".")
  if (t === "") return null
  const n = Number(t)
  return Number.isFinite(n) ? String(n) : null
}

/** Same number? (`"48"` and `"48.0"` and `48` are equal.) */
export function takaSamaLiczba(a: string | number, b: string | number): boolean {
  const x = normalizujLiczbe(a)
  return x !== null && x === normalizujLiczbe(b)
}

/** The canonical text of a value that may be saved as this quantity; `null` = not a number or outside the allowed range. */
export function wartoscDoZapisu(id: WielkoscId, tekst: string | number): string | null {
  const n = normalizujLiczbe(tekst)
  if (n === null) return null
  const def: DefinicjaWielkosci = WIELKOSCI[id]
  const x = Number(n)
  if (def.min !== undefined && x < def.min) return null
  if (def.max !== undefined && x > def.max) return null
  return n
}

/** Validates a stored record read back from storage (anything malformed is dropped, never guessed). */
export function parsujWartosci(zapis: unknown): WartosciProjektu {
  if (typeof zapis !== "object" || zapis === null) return {}
  const wynik: WartosciProjektu = {}
  for (const [k, w] of Object.entries(zapis as Record<string, unknown>)) {
    if (!czyWielkosc(k) || typeof w !== "object" || w === null) continue
    const { v, zrodlo, iso } = w as Record<string, unknown>
    if (typeof v !== "string" || normalizujLiczbe(v) === null) continue
    wynik[k] = { v, zrodlo: typeof zrodlo === "string" ? zrodlo : "", iso: typeof iso === "string" ? iso : "" }
  }
  return wynik
}
