import type { Warning } from "@/lib/core/calc-result"

/** Accuracy class of the meter is not in the data — the app shows the difference, never a verdict. */
export function roznicaBezWerdyktu(): Warning {
  return {
    code: "SIEC-LICZNIK-ROZNICA-BEZ-WERDYKTU",
    level: "info",
    i18nKey: "SIEC-LICZNIK-ROZNICA-BEZ-WERDYKTU",
    technicalMessage: "klasa dokładności licznika nieznana — brak progu oceny",
  }
}
