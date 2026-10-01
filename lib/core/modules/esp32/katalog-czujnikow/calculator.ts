import type { CalcResult } from "@/lib/core/calc-result"
import {
  calculateKatalogKomponentow,
  type KatalogKomponentowResult,
} from "@/lib/core/modules/esp32/katalog-komponentow/calculator"
import type { KatalogCzujnikowInput } from "./input"

// 🔎 TD8 (dlug-techniczny.md): instancja czujnika ma tylko etykietę i lokalizację. Źródło
// wprost specyfikuje trzecią właściwość konfiguracyjną per instancję — "progi alarmowe" —
// NIE zbudowaną (brak pola w typie i w UI).
export const CALCULATOR_VERSION = "1.0.0"

export type KatalogCzujnikowResult = KatalogKomponentowResult

/**
 * Moduł 9, Katalog 1 — "Czujniki" (docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md).
 * Wzorzec H: brak "wyniku" w sensie fizycznym — to podsumowanie stanu katalogu,
 * ile instancji dodano i ile różnych typów jest w użyciu. Echo wspólnego silnika katalogów M9
 * (`katalog-komponentow`, Dyrektywa #8).
 */
export function calculateKatalogCzujnikow(
  input: KatalogCzujnikowInput,
): CalcResult<KatalogCzujnikowResult> {
  return { ...calculateKatalogKomponentow(input), calculatorVersion: CALCULATOR_VERSION }
}
