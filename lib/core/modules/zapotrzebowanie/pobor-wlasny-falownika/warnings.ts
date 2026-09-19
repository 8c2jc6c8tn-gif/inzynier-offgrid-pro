import type { Warning } from "@/lib/core/calc-result"

export function poborUjemny(value: number): Warning {
  return {
    code: "POBOR-UJEMNY",
    level: "critical",
    i18nKey: "POBOR-JALOWY-UJEMNY",
    technicalMessage: `poborJalowyW = ${value}, oczekiwano >= 0`,
    field: "poborJalowyW",
  }
}

export function stalyKosztBilansu(strataDobowaKwh: number): Warning {
  return {
    code: "STALY-KOSZT-BILANSU",
    level: "info",
    i18nKey: "STALY-KOSZT-BILANSU",
    params: { strata: strataDobowaKwh.toFixed(2) },
    technicalMessage: `strataDobowaKwh = ${strataDobowaKwh}`,
  }
}
