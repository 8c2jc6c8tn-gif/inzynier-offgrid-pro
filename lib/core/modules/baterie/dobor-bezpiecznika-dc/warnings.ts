import type { Warning } from "@/lib/core/calc-result"
import { MIN_AIC_LIFEPO4_A } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 */

export function notPositive(field: string, labelKey: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { labelKey },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function aicPonizejPraduZwarciowego(aicA: number, pradZwarciowyA: number): Warning {
  return {
    code: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    level: "critical",
    i18nKey: "AIC-PONIZEJ-PRADU-ZWARCIOWEGO",
    technicalMessage: `aicBezpiecznikaA = ${aicA} < pradZwarciowyA = ${pradZwarciowyA}`,
    field: "aicBezpiecznikaA",
  }
}

export function aicPonizejZalecanegoMinimum(aicA: number): Warning {
  return {
    code: "AIC-PONIZEJ-ZALECANEGO-MINIMUM",
    level: "warning",
    i18nKey: "AIC-PONIZEJ-ZALECANEGO-MINIMUM",
    params: { min: MIN_AIC_LIFEPO4_A },
    technicalMessage: `aicBezpiecznikaA = ${aicA} < MIN_AIC_LIFEPO4_A = ${MIN_AIC_LIFEPO4_A}`,
    field: "aicBezpiecznikaA",
  }
}
