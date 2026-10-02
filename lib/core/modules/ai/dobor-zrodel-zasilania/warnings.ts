import type { Warning } from "@/lib/core/calc-result"

export function pradUjemny(value: number): Warning {
  return {
    code: "AIZR-PRAD-UJEMNY",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `pradMozliwyA = ${value}, expected >= 0`,
    field: "pradMozliwyA",
  }
}

export function pradOgraniczony(mozliwyA: number, maxA: number, temperaturaC: number): Warning {
  return {
    code: "AIZR-PRAD-OGRANICZONY",
    level: "info",
    params: { mozliwy: Math.round(mozliwyA * 10) / 10, max: Math.round(maxA * 10) / 10, t: temperaturaC },
    technicalMessage: `charge current limited ${mozliwyA} A -> ${maxA} A at ${temperaturaC} °C`,
    field: "pradMozliwyA",
  }
}

export function bezTemperatury(): Warning {
  return {
    code: "AIZR-BEZ-TEMPERATURY",
    level: "info",
    technicalMessage: "no cell temperature or capacity — charge current limit (12.8) not checked",
    field: "temperaturaOgniwaC",
  }
}
