/**
 * Telemetry sample: the single internal shape every transport (CSV, HTTP, serial, BLE, simulator)
 * is normalised to. Screens and quality checks only ever see this type, so swapping a transport
 * never touches them.
 */

/** Physical quantities with their canonical unit and a wide plausibility range (sensor sanity, not a norm). */
export const WIELKOSCI = {
  napiecie: { jednostka: "V", min: -1000, max: 1000 },
  prad: { jednostka: "A", min: -2000, max: 2000 },
  moc: { jednostka: "W", min: -1_000_000, max: 1_000_000 },
  energia: { jednostka: "Wh", min: 0, max: 1_000_000_000 },
  temperatura: { jednostka: "°C", min: -80, max: 400 },
  soc: { jednostka: "%", min: 0, max: 100 },
  czestotliwosc: { jednostka: "Hz", min: 0, max: 1000 },
  naswietlenie: { jednostka: "W/m²", min: 0, max: 2000 },
} as const

export type Wielkosc = keyof typeof WIELKOSCI

export const WIELKOSCI_LISTA = Object.keys(WIELKOSCI) as Wielkosc[]

export function czyWielkosc(x: unknown): x is Wielkosc {
  return typeof x === "string" && Object.prototype.hasOwnProperty.call(WIELKOSCI, x)
}

/** Quality flag: `brak` is an explicit "no data" state — never a silent zero. */
export type JakoscProbki = "ok" | "poza-zakresem" | "brak"

export interface ProbkaTelemetrii {
  /** Source id from the registry (a CSV import, a device, the simulator…). */
  zrodloId: string
  /** Device/channel within the source, e.g. "bms-1", "mppt-a". */
  kanal: string
  /** Epoch milliseconds (UTC). */
  czas: number
  wielkosc: Wielkosc
  /** Value in the canonical unit of `wielkosc`; null only when jakosc === "brak". */
  wartosc: number | null
  jakosc: JakoscProbki
}

/** Builds a sample and sets the quality flag from the plausibility range. */
export function zbudujProbke(
  p: Omit<ProbkaTelemetrii, "jakosc" | "wartosc"> & { wartosc: number | null },
): ProbkaTelemetrii {
  if (p.wartosc === null || !Number.isFinite(p.wartosc)) return { ...p, wartosc: null, jakosc: "brak" }
  const { min, max } = WIELKOSCI[p.wielkosc]
  return { ...p, jakosc: p.wartosc < min || p.wartosc > max ? "poza-zakresem" : "ok" }
}

/** Unit conversions accepted on input; returns null when the unit is unknown for that quantity. */
export function przeliczJednostke(wielkosc: Wielkosc, wartosc: number, jednostka: string): number | null {
  const j = jednostka.trim()
  const kanon = WIELKOSCI[wielkosc].jednostka
  if (j === kanon) return wartosc
  const tabela: Record<string, Record<string, number>> = {
    napiecie: { mV: 0.001, kV: 1000 },
    prad: { mA: 0.001, kA: 1000 },
    moc: { kW: 1000, mW: 0.001, MW: 1_000_000 },
    energia: { kWh: 1000, MWh: 1_000_000, Ah: NaN },
    czestotliwosc: { kHz: 1000 },
  }
  const f = tabela[wielkosc]?.[j]
  if (f === undefined || Number.isNaN(f)) {
    if (wielkosc === "temperatura") {
      if (j === "C" || j === "degC") return wartosc
      if (j === "K") return wartosc - 273.15
      if (j === "°F" || j === "F") return ((wartosc - 32) * 5) / 9
    }
    return null
  }
  return wartosc * f
}
