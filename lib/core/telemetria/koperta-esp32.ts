import { z } from "zod"
import { czyWielkosc, przeliczJednostke, zbudujProbke, type ProbkaTelemetrii } from "./probka"

/**
 * ESP32 → app envelope, schema version 1. One contract for every transport:
 * HTTP body, serial line (NDJSON) and reassembled BLE notification all carry this JSON.
 * Documented in docs/telemetria-kontrakt-esp32.md.
 */
export const WERSJA_KOPERTY = 1

const KanalSchema = z.object({
  /** Channel name within the device, e.g. "bms-1". */
  k: z.string().min(1),
  /** Quantity key (see WIELKOSCI), e.g. "napiecie". */
  w: z.string().min(1),
  /** Value; null = sensor reported no data. */
  v: z.number().nullable(),
  /** Unit as sent by the firmware; converted to the canonical one. */
  u: z.string().min(1),
})

export const KopertaEsp32Schema = z.object({
  /** Schema version. */
  s: z.literal(WERSJA_KOPERTY),
  /** Device id. */
  d: z.string().min(1),
  /** Epoch seconds (UTC) from the device clock. */
  t: z.number().int().nonnegative(),
  c: z.array(KanalSchema).min(1),
})

export type KopertaEsp32 = z.infer<typeof KopertaEsp32Schema>

export interface WynikKoperty {
  probki: ProbkaTelemetrii[]
  /** Channels dropped because the quantity or unit was unknown (reported, never silently lost). */
  odrzucone: { kanal: string; powod: "nieznana-wielkosc" | "nieznana-jednostka" }[]
}

export type WynikParsowania = { ok: true; wynik: WynikKoperty } | { ok: false; blad: string }

/** Parses raw text (one envelope) into normalised samples. */
export function parsujKoperte(tekst: string, zrodloId: string): WynikParsowania {
  let json: unknown
  try {
    json = JSON.parse(tekst)
  } catch {
    return { ok: false, blad: "nieprawidlowy-json" }
  }
  const r = KopertaEsp32Schema.safeParse(json)
  if (!r.success) return { ok: false, blad: "nieprawidlowa-koperta" }
  const probki: ProbkaTelemetrii[] = []
  const odrzucone: WynikKoperty["odrzucone"] = []
  for (const c of r.data.c) {
    if (!czyWielkosc(c.w)) {
      odrzucone.push({ kanal: c.k, powod: "nieznana-wielkosc" })
      continue
    }
    let wartosc: number | null = null
    if (c.v !== null) {
      wartosc = przeliczJednostke(c.w, c.v, c.u)
      if (wartosc === null) {
        odrzucone.push({ kanal: c.k, powod: "nieznana-jednostka" })
        continue
      }
    }
    probki.push(zbudujProbke({ zrodloId, kanal: `${r.data.d}/${c.k}`, czas: r.data.t * 1000, wielkosc: c.w, wartosc }))
  }
  return { ok: true, wynik: { probki, odrzucone } }
}

/** Splits a text stream into complete lines, keeping the unfinished tail (serial NDJSON, BLE fragments). */
export function skladajLinie(bufor: string, nowe: string): { linie: string[]; reszta: string } {
  const calosc = bufor + nowe
  const czesci = calosc.split("\n")
  const reszta = czesci.pop() ?? ""
  return { linie: czesci.map((l) => l.trim()).filter((l) => l.length > 0), reszta }
}
