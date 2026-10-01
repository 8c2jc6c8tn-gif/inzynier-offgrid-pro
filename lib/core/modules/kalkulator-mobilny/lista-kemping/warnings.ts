import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Biblia §12.35: "Nie zapomnij o gaśnicy i mierniku – to podstawa bezpieczeństwa." */
export function brakGasnicyLubMiernika(): Warning {
  return {
    code: "LKK-GASNICA-MIERNIK",
    level: "warning",
    i18nKey: "LKK-GASNICA-MIERNIK",
    technicalMessage: "gasnica or miernik not checked (Biblia §12.35)",
  }
}
