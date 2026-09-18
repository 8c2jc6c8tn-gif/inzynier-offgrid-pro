import type { Warning } from "@/lib/core/calc-result"

export function brakOchrony(): Warning {
  return {
    code: "BRAK-OCHRONY",
    level: "critical",
    i18nKey: "BRAK-OCHRONY",
    technicalMessage: "typOchrony=brak",
  }
}

export function ochronaZastosowana(): Warning {
  return {
    code: "OCHRONA-ZASTOSOWANA",
    level: "info",
    i18nKey: "OCHRONA-ZASTOSOWANA",
    technicalMessage: "typOchrony != brak",
  }
}
