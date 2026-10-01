import type { CalcResult } from "@/lib/core/calc-result"
import type { KatalogKomponentowInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

export type KatalogKomponentowResult = {
  liczbaInstancji: number
  liczbaTypowUzytych: number
}

/**
 * Moduł 9, Katalogi 1–4 — Wzorzec H: brak "wyniku" w sensie fizycznym, podsumowanie stanu katalogu (ile instancji
 * dodano, ile różnych typów jest w użyciu). Wspólny silnik wszystkich katalogów (Dyrektywa #8 — bez kopii per katalog).
 */
export function calculateKatalogKomponentow(input: KatalogKomponentowInput): CalcResult<KatalogKomponentowResult> {
  const liczbaInstancji = input.instances.length
  const liczbaTypowUzytych = new Set(input.instances.map((i) => i.typeId)).size

  return {
    value: { liczbaInstancji, liczbaTypowUzytych },
    unit: "szt.",
    status: liczbaInstancji === 0 ? "INCOMPLETE" : "VALID",
    formula: "",
    inputs: { liczbaInstancji, liczbaTypowUzytych },
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
