import type { Warning } from "@/lib/core/calc-result"

/** 🔴 Burnt smell / melted insulation — disconnect the battery before anything else (fire risk). */
export function odlaczZasilanie(krokId: string): Warning {
  return {
    code: "DG-ODLACZ-ZASILANIE",
    level: "critical",
    i18nKey: "DG-ODLACZ-ZASILANIE",
    technicalMessage: `krok ${krokId} = problem`,
    field: krokId,
  }
}

/** ℹ️ Biblia §12.38: "Nie zwieraj przewodów podczas testów – grozi pożarem." Always shown. */
export function bezpieczenstwoPomiarow(): Warning {
  return {
    code: "DG-BEZPIECZNE-POMIARY",
    level: "info",
    i18nKey: "DG-BEZPIECZNE-POMIARY",
    technicalMessage: "always shown (Biblia §12.38)",
  }
}

/** ℹ️ Every step answered "ok" — the cause is outside the simple tree. */
export function nieZnaleziono(): Warning {
  return {
    code: "DG-NIE-ZNALEZIONO",
    level: "info",
    i18nKey: "DG-NIE-ZNALEZIONO",
    technicalMessage: "all steps ok",
  }
}
