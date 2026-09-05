import type { CalcResult } from "@/lib/core/calc-result"
import type { KatalogCzujnikowInput } from "./input"

// 🔎 TD8 (dlug-techniczny.md): instancja czujnika ma tylko etykietę i lokalizację. Źródło
// wprost specyfikuje trzecią właściwość konfiguracyjną per instancję — "progi alarmowe" —
// NIE zbudowaną (brak pola w typie i w UI).
export const CALCULATOR_VERSION = "1.0.0"

export type KatalogCzujnikowResult = {
  liczbaInstancji: number
  liczbaTypowUzytych: number
}

/**
 * Moduł 9, Katalog 1 — "Czujniki" (docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md).
 * Wzorzec H: brak "wyniku" w sensie fizycznym — to podsumowanie stanu katalogu,
 * ile instancji dodano i ile różnych typów jest w użyciu.
 */
export function calculateKatalogCzujnikow(
  input: KatalogCzujnikowInput,
): CalcResult<KatalogCzujnikowResult> {
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
