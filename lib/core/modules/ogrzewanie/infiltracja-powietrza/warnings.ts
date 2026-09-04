import type { Warning } from "@/lib/core/calc-result"
import { WYMIANY_SANITY_MAX } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function wymianyPozaSanityCheck(value: number): Warning {
  return {
    code: "WYMIANY-POZA-SANITY-CHECK",
    level: "info",
    message: `To nietypowo wysoka liczba wymian powietrza na godzinę (>${WYMIANY_SANITY_MAX}) — sprawdź dane z testu szczelności.`,
    technicalMessage: `value = ${value} > ${WYMIANY_SANITY_MAX}`,
  }
}

export function strataInfo(strataCieplnaKw: number): Warning {
  return {
    code: "STRATA-INFILTRACJI",
    level: "info",
    message: `Strata ciepła przez infiltrację: ${strataCieplnaKw.toFixed(2)} kW.`,
    technicalMessage: `strataCieplnaKw=${strataCieplnaKw}`,
  }
}
