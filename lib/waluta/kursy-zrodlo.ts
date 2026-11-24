/**
 * Rates source shared by the server route (`app/api/kursy/route.ts`) and the client fallback:
 * NBP average rates, table A (owner decision 24.11.2026; until 3.54 the ECB via Frankfurter).
 * Pure helpers — no `window`, safe on the server.
 *
 * NBP quotes `mid` = PLN for 1 unit of the currency; the app keeps rates as units of the currency
 * for 1 PLN (`przelicz.ts`), so a rate is stored as 1 / mid. The NBP API sends
 * `Access-Control-Allow-Origin: *`, so the browser can ask it directly when our route fails
 * (checked 24.11.2026).
 */
import { WALUTY } from "./waluty"
import type { Kursy } from "./przelicz"

export const URL_TABELI_NBP = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json"
/** Our own copy of the rates (server cache) — the first thing the app asks when online. */
export const URL_KURSOW_SERWER = "/api/kursy"

/**
 * NBP table A body (`[{ table, no, effectiveDate, rates: [{ currency, code, mid }] }]`) → the app's shape
 * (`date` = the table's effective date, rates = 1 / mid for the currencies the app offers). `null` when unusable.
 */
export function parsujTabeleNbp(json: unknown): OdpowiedzKursow | null {
  const tabela = Array.isArray(json) ? json[0] : null
  if (!tabela || typeof tabela !== "object") return null
  const { effectiveDate, rates } = tabela as { effectiveDate?: unknown; rates?: unknown }
  if (typeof effectiveDate !== "string" || !Array.isArray(rates)) return null
  const znane = new Set<string>(WALUTY.map((w) => w.kod))
  const wynik: Kursy = {}
  for (const r of rates) {
    if (!r || typeof r !== "object") continue
    const { code, mid } = r as { code?: unknown; mid?: unknown }
    if (typeof code !== "string" || !znane.has(code) || typeof mid !== "number" || !Number.isFinite(mid) || mid <= 0) continue
    wynik[code] = 1 / mid
  }
  return Object.keys(wynik).length > 0 ? { date: effectiveDate, rates: wynik } : null
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
  /** Publication date of the rates (YYYY-MM-DD; NBP table A effective date). */
  date: string
  rates: Kursy
}

/** Validates the body our `/api/kursy` returns (`{ date, rates }`, rates per 1 PLN); `null` when unusable. */
export function parsujOdpowiedzKursow(json: unknown): OdpowiedzKursow | null {
  if (!json || typeof json !== "object") return null
  const o = json as { date?: unknown; rates?: unknown }
  const rates = liczbyDodatnie(o.rates)
  if (Object.keys(rates).length === 0) return null
  return { date: typeof o.date === "string" ? o.date : "", rates }
}
