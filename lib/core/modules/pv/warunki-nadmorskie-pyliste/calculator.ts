import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { WarunkiNadmorskiePylisteInput } from "./input"
import {
  brakAntyPid,
  brakIec61701,
  brakRamyAnodowanej,
  pylistaRysowanieSzkla,
  warunkiSpelnione,
  zlaczkiNiemorskie,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type WarunkiNadmorskiePylisteResult = {
  /** Liczba niespełnionych reguł doboru (ostrzeżeń `warning`). */
  niespelnioneReguly: number
}

/**
 * Ekran 25, Moduł 3 — "Dobór paneli do warunków nadmorskich i pylistych" (dawne 2.45). Reguły 1:1
 * ze źródła, bez wzoru liczbowego:
 * - nadmorska → certyfikat IEC 61701 (mgła solna), rama anodowana, złączki MC4 do warunków
 *   morskich (🟡 źródła), panele anty-PID (Sekcja C);
 * - pylista → ryzyko rysowania szkła, częstsze czyszczenie (informacja — nie ma czego odhaczyć);
 * - wysoka wilgotność → podwyższone ryzyko PID → anty-PID (cross-ref `ryzyko-pid`).
 * Poziom `warning`, nie `critical` — źródło nie zalicza tych reguł do twardych stopów modułu.
 * Brak wybranego typu lokalizacji → INCOMPLETE (3.3), nigdy domyślne "standardowa".
 */
export function calculateWarunkiNadmorskiePyliste(
  input: WarunkiNadmorskiePylisteInput,
): CalcResult<WarunkiNadmorskiePylisteResult> {
  if (input.typLokalizacji === null) {
    return {
      value: { niespelnioneReguly: 0 },
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs: {},
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const nadmorska = input.typLokalizacji === "nadmorska"
  const warnings: Warning[] = []
  if (nadmorska && !input.certyfikatIec61701) warnings.push(brakIec61701())
  if (nadmorska && !input.ramaAnodowana) warnings.push(brakRamyAnodowanej())
  if (nadmorska && !input.zlaczkiMorskie) warnings.push(zlaczkiNiemorskie())
  if ((nadmorska || input.wilgotnoscWysoka) && !input.certyfikatAntyPid) warnings.push(brakAntyPid())

  const niespelnioneReguly = warnings.length
  if (input.typLokalizacji === "pylista") warnings.push(pylistaRysowanieSzkla())
  if (niespelnioneReguly === 0) warnings.push(warunkiSpelnione())

  return {
    value: { niespelnioneReguly },
    unit: "",
    status: niespelnioneReguly > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
