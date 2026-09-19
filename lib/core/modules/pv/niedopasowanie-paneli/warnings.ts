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

export function duzaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "DUZA-ROZNICA-MOCY",
    level: "critical",
    i18nKey: "DUZA-ROZNICA-MOCY",
    params: { roznica: roznicaPct.toFixed(1) },
    technicalMessage: `roznicaPct=${roznicaPct} > 15`,
  }
}

export function umiarkowanaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "UMIARKOWANA-ROZNICA-MOCY",
    level: "warning",
    i18nKey: "UMIARKOWANA-ROZNICA-MOCY",
    params: { roznica: roznicaPct.toFixed(1) },
    technicalMessage: `10 < roznicaPct=${roznicaPct} <= 15`,
  }
}

export function malaRoznicaMocy(roznicaPct: number): Warning {
  return {
    code: "MALA-ROZNICA-MOCY",
    level: "info",
    i18nKey: "MALA-ROZNICA-MOCY",
    params: { roznica: roznicaPct.toFixed(1) },
    technicalMessage: `roznicaPct=${roznicaPct} <= 10`,
  }
}
