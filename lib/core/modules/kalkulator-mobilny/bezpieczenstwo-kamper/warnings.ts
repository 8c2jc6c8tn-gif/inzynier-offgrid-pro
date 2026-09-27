import type { Warning } from "@/lib/core/calc-result"

export function brakWentylacjiOlowiowy(kod: string): Warning {
  return {
    code: kod,
    level: "warning",
    i18nKey: kod,
    technicalMessage: "akumulator ołowiowy, pozycja wentylacji niepotwierdzona",
  }
}

export function lifepo4Info(kod: string): Warning {
  return {
    code: kod,
    level: "info",
    i18nKey: kod,
    technicalMessage: "LiFePO4 — nie wydziela gazów przy normalnej pracy",
  }
}
