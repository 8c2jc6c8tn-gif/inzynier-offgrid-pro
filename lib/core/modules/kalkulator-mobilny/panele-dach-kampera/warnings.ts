import type { Warning } from "@/lib/core/calc-result"

/** 🟡 No panel fits on any free section of the roof. */
export function panelSieNieMiesci(): Warning {
  return {
    code: "DK-PANEL-SIE-NIE-MIESCI",
    level: "warning",
    i18nKey: "DK-PANEL-SIE-NIE-MIESCI",
    technicalMessage: "liczbaPaneli = 0",
  }
}

/** ℹ️ Biblia §12.27: mounting, cable gland and roof load are checked separately. */
export function sprawdzMocowanie(): Warning {
  return {
    code: "DK-SPRAWDZ-MOCOWANIE",
    level: "info",
    i18nKey: "DK-SPRAWDZ-MOCOWANIE",
    technicalMessage: "always shown",
  }
}
