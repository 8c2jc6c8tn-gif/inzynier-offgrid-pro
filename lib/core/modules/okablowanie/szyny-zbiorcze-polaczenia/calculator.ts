import type { CalcResult } from "@/lib/core/calc-result"
import type { SzynyZbiorczePolaczeniaInput } from "./input"
import { CHECKLIST_ITEMS } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type SzynyZbiorczePolaczeniaResult = {
  potwierdzone: number
  razem: number
}

/**
 * Ekran 3, Moduł 5 "Okablowanie i zabezpieczenia" — "Szyny zbiorcze i połączenia" (dawne 4.19,
 * 4.20, 4.24, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Tylko dolna sekcja E (checklist
 * momentów dokręcania) — górna sekcja D (dobór przekroju szyny wg wytrzymałości zwarciowej)
 * świadomie NIE zbudowana (brak wzoru w źródle). Zdjęcie połączenia (§13.2 źródła) pominięte w
 * checkliście — źródło samo oznacza je jako opcjonalne, nie krok wymagany do odbioru.
 */
export function calculateSzynyZbiorczePolaczenia(
  input: SzynyZbiorczePolaczeniaInput,
): CalcResult<SzynyZbiorczePolaczeniaResult> {
  const validIds = new Set(CHECKLIST_ITEMS.map((item) => item.id))
  const potwierdzoneUnikalne = new Set(input.potwierdzoneIds.filter((id) => validIds.has(id)))
  const potwierdzone = potwierdzoneUnikalne.size
  const razem = CHECKLIST_ITEMS.length

  return {
    value: { potwierdzone, razem },
    unit: "kroków potwierdzonych",
    status: potwierdzone === razem ? "VALID" : "INCOMPLETE",
    formula: "",
    inputs: { potwierdzone, razem },
    assumptions: [
      { kod: "SZYNY-ZALOZENIE-BRAK-DOBORU-PRZEKROJU" },
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
