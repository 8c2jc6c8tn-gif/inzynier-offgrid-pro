/**
 * Client-side reading of the `/api/pvgis/seriescalc` proxy response (shape from its route.ts) and the
 * UI keys of its error codes. Pure functions; the series itself is stored in the screen's draft
 * (the history field), so no separate local store is needed (offline after the first download).
 */
import type { DaneSeriescalc } from "@/lib/adapters/pvgis/seriescalc"
import type { KodBleduPvgis } from "@/lib/adapters/pvgis/tmy"

export const KLUCZ_BLEDU_SERIESCALC: Record<KodBleduPvgis | "SIEC", string> = {
  "PVGIS-PARAMETRY-NIEPOPRAWNE": "UI-M7-DEFM-PVGIS-E-PARAMETRY",
  "PVGIS-ODRZUCIL-ZAPYTANIE": "UI-M7-DEFM-PVGIS-E-ODRZUCIL",
  "PVGIS-TIMEOUT": "UI-M7-DEFM-PVGIS-E-TIMEOUT",
  "PVGIS-NIEDOSTEPNY": "UI-M7-DEFM-PVGIS-E-NIEDOSTEPNY",
  "PVGIS-NIEOCZEKIWANY-FORMAT": "UI-M7-DEFM-PVGIS-E-FORMAT",
  SIEC: "UI-M7-DEFM-PVGIS-E-SIEC",
}

export function odczytajOdpowiedzSeriescalc(
  json: unknown,
): { ok: true; dane: DaneSeriescalc } | { ok: false; kod: KodBleduPvgis } {
  const o = json as { ok?: unknown; dane?: DaneSeriescalc; kod?: unknown }
  if (o && o.ok === true && o.dane && Array.isArray(o.dane.lata) && o.dane.lata.length > 0) return { ok: true, dane: o.dane }
  const kod = typeof o?.kod === "string" && o.kod in KLUCZ_BLEDU_SERIESCALC && o.kod !== "SIEC" ? (o.kod as KodBleduPvgis) : "PVGIS-NIEOCZEKIWANY-FORMAT"
  return { ok: false, kod }
}
