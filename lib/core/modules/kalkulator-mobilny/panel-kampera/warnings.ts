import type { Warning } from "@/lib/core/calc-result"

/** 🟡 Biblia §12.26: "Elastyczne panele bez szczeliny wentylacyjnej przegrzewają się i tracą wydajność." */
export function elastycznyBezWentylacji(): Warning {
  return {
    code: "PK-ELASTYCZNY-BEZ-WENTYLACJI",
    level: "warning",
    i18nKey: "PK-ELASTYCZNY-BEZ-WENTYLACJI",
    technicalMessage: "elastycznyBezSzczeliny = true (Biblia §12.26)",
    field: "elastycznyBezSzczeliny",
  }
}

/** ℹ️ Heating losses depend on the temperature coefficient — M3 `wplyw-temperatury`. */
export function sprawdzTemperature(): Warning {
  return {
    code: "PK-SPRAWDZ-TEMPERATURE",
    level: "info",
    i18nKey: "PK-SPRAWDZ-TEMPERATURE",
    technicalMessage: "always shown — odsyłacz do M3 wplyw-temperatury",
  }
}
