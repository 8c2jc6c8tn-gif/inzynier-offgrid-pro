import type { Warning } from "@/lib/core/calc-result"
import { WYMIANY_SANITY_MAX } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wymianyPozaSanityCheck(value: number): Warning {
  return {
    code: "WYMIANY-POZA-SANITY-CHECK",
    level: "info",
    i18nKey: "WYMIANY-POZA-SANITY-CHECK",
    params: { max: WYMIANY_SANITY_MAX },
    technicalMessage: `value = ${value} > ${WYMIANY_SANITY_MAX}`,
  }
}

export function strataInfo(strataCieplnaKw: number): Warning {
  return {
    code: "STRATA-INFILTRACJI",
    level: "info",
    i18nKey: "STRATA-INFILTRACJI",
    params: { strata: strataCieplnaKw.toFixed(2) },
    technicalMessage: `strataCieplnaKw=${strataCieplnaKw}`,
  }
}
