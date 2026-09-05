import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 * Ostrzeżenia o progu docisku żyją w Module 4/Ekran 21 (`pozycjonowanie-ogniw/warnings.ts`) —
 * reużyte tu wprost (wzorzec "echo"), nie zduplikowane.
 */

export function dociskNiedodatni(value: number): Warning {
  return {
    code: "DOCISK-NIEDODATNI",
    level: "critical",
    message: "Docisk musi być większy od zera.",
    technicalMessage: `dociskKgf = ${value}, oczekiwano > 0`,
    field: "dociskKgf",
  }
}
