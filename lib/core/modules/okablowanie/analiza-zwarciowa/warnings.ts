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

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyMaksymalnyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    i18nKey: "AIC-PONIZEJ-MAX-PRADU-ZWARCIOWEGO",
    params: { aic: aicA, pradZwarciowy: pradZwarciowyMaksymalnyA.toFixed(0) },
    technicalMessage: `aicZabezpieczeniaA=${aicA} < pradZwarciowyMaksymalnyA=${pradZwarciowyMaksymalnyA}`,
  }
}

export function aicWystarczajace(aicA: number): Warning {
  return {
    code: "AIC-WYSTARCZAJACE",
    level: "info",
    i18nKey: "AIC-WYSTARCZAJACE-NA-PRAD-ZWARCIOWY",
    params: { aic: aicA },
    technicalMessage: `aicZabezpieczeniaA=${aicA}`,
  }
}
