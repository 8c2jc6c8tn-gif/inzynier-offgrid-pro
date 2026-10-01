import type { Warning } from "@/lib/core/calc-result"

/** Biblia §12.50: fuel energy is expensive — use the generator only to charge batteries or briefly. ℹ️, always shown. */
export function drogiePaliwo(): Warning {
  return {
    code: "AP-DROGIE-PALIWO",
    level: "info",
    i18nKey: "AP-DROGIE-PALIWO",
    technicalMessage: "always shown (Biblia §12.50)",
  }
}
