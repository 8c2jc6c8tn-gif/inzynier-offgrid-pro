import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function utrataMocy(temperaturaPanelaC: number, strataPct: number): Warning {
  return {
    code: "UTRATA-MOCY",
    level: "info",
    i18nKey: "UTRATA-MOCY",
    params: { temperatura: temperaturaPanelaC.toFixed(0), strata: strataPct.toFixed(1) },
    technicalMessage: `temperaturaPanelaC=${temperaturaPanelaC}, strataPct=${strataPct}`,
  }
}
