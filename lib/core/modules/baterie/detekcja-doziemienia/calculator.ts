import type { CalcResult } from "@/lib/core/calc-result"
import type { DetekcjaDoziemieniaInput } from "./input"
import { brakZabezpieczenia, zabezpieczenieObecne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type DetekcjaDoziemieniaResult = {
  zabezpieczony: boolean
}

/**
 * Ekran 29, Moduł 4 "Magazyn energii / baterie" — "Detekcja doziemienia (Ground Fault & IMD)"
 * (dawne 3.32, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Sprawdzenie obecności
 * zabezpieczenia (IMD lub różnicówka DC) 1:1 ze źródła — bez symulacji konkretnego scenariusza
 * przebicia (przykład Sekcji C jest opisowy, nie liczbowy, więc nie liczony).
 */
export function calculateDetekcjaDoziemienia(
  input: DetekcjaDoziemieniaInput,
): CalcResult<DetekcjaDoziemieniaResult> {
  const zabezpieczony = input.maMonitorIzolacji || input.maRoznicowkeDc

  return {
    value: { zabezpieczony },
    unit: "",
    status: zabezpieczony ? "VALID" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs: {},
    assumptions: [],
    warnings: [zabezpieczony ? zabezpieczenieObecne() : brakZabezpieczenia()],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
