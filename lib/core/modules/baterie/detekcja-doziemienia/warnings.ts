import type { Warning } from "@/lib/core/calc-result"

export function brakZabezpieczenia(): Warning {
  return {
    code: "BRAK-ZABEZPIECZENIA-DOZIEMIENIA",
    level: "critical",
    i18nKey: "BRAK-ZABEZPIECZENIA-DOZIEMIENIA",
    technicalMessage: "maMonitorIzolacji === false && maRoznicowkeDc === false",
  }
}

export function zabezpieczenieObecne(): Warning {
  return {
    code: "ZABEZPIECZENIE-OBECNE",
    level: "info",
    i18nKey: "ZABEZPIECZENIE-OBECNE",
    technicalMessage: "maMonitorIzolacji === true || maRoznicowkeDc === true",
  }
}
