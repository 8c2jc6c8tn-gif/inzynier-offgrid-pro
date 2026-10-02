/**
 * Rates source shared by the server route (`app/api/kursy/route.ts`) and the client fallback:
 * ECB reference rates via Frankfurter, base PLN. Pure helpers — no `window`, safe on the server.
 */
import { WALUTA_BAZOWA, WALUTY } from "./waluty"
import type { Kursy } from "./przelicz"

export const URL_KURSOW = "https://api.frankfurter.dev/v1/latest"
/** Our own copy of the rates (server cache) — the first thing the app asks when online. */
export const URL_KURSOW_SERWER = "/api/kursy"

/** Query for every currency the ECB feed publishes (UAH etc. are manual-rate only). */
export function urlKursowEbc(): string {
  const symbole = WALUTY.filter((w) => w.automatyczny && w.kod !== WALUTA_BAZOWA).map((w) => w.kod).join(",")
  return `${URL_KURSOW}?base=${WALUTA_BAZOWA}&symbols=${symbole}`
}

export function liczbyDodatnie(v: unknown): Kursy {
  const wynik: Kursy = {}
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      if (typeof x === "number" && Number.isFinite(x) && x > 0) wynik[k] = x
    }
  }
  return wynik
}

export interface OdpowiedzKursow {
  /** ECB publication date (YYYY-MM-DD). */
  date: string
  rates: Kursy
}

/** Validates a Frankfurter-shaped body (also what our `/api/kursy` returns); `null` when unusable. */
export function parsujOdpowiedzKursow(json: unknown): OdpowiedzKursow | null {
  if (!json || typeof json !== "object") return null
  const o = json as { date?: unknown; rates?: unknown }
  const rates = liczbyDodatnie(o.rates)
  if (Object.keys(rates).length === 0) return null
  return { date: typeof o.date === "string" ? o.date : "", rates }
}
