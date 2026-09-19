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

export function strataPonizejCelu(strataPct: number, celPct: number): Warning {
  return {
    code: "STRATA-PONIZEJ-CELU",
    level: "info",
    i18nKey: "STRATA-PONIZEJ-CELU",
    params: { strata: strataPct.toFixed(1), cel: celPct },
    technicalMessage: `strataPct=${strataPct}, celPct=${celPct}`,
  }
}

export function strataPowyzejCelu(strataPct: number, celPct: number): Warning {
  return {
    code: "STRATA-POWYZEJ-CELU",
    level: "warning",
    i18nKey: "STRATA-POWYZEJ-CELU",
    params: { strata: strataPct.toFixed(1), cel: celPct },
    technicalMessage: `strataPct=${strataPct}, celPct=${celPct}`,
  }
}
