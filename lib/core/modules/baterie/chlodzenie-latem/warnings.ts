import type { Warning } from "@/lib/core/calc-result"
import { ZAKRES_PRACY_MAX_C, ZAKRES_PRACY_MIN_C } from "./constants"

export function powyzejZakresu(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-POWYZEJ-ZAKRESU",
    level: "critical",
    i18nKey: "TEMPERATURA-POWYZEJ-ZAKRESU",
    params: { temp: temperaturaC.toFixed(1), max: ZAKRES_PRACY_MAX_C },
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} > ZAKRES_PRACY_MAX_C = ${ZAKRES_PRACY_MAX_C}`,
    field: "temperaturaOgniwC",
  }
}

export function ponizejZakresu(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-PONIZEJ-ZAKRESU",
    level: "info",
    i18nKey: "TEMPERATURA-PONIZEJ-ZAKRESU",
    params: { temp: temperaturaC.toFixed(1), min: ZAKRES_PRACY_MIN_C },
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} < ZAKRES_PRACY_MIN_C = ${ZAKRES_PRACY_MIN_C}`,
    field: "temperaturaOgniwC",
  }
}

export function wZakresie(temperaturaC: number): Warning {
  return {
    code: "TEMPERATURA-W-ZAKRESIE",
    level: "info",
    i18nKey: "TEMPERATURA-W-ZAKRESIE",
    params: { temp: temperaturaC.toFixed(1), min: ZAKRES_PRACY_MIN_C, max: ZAKRES_PRACY_MAX_C },
    technicalMessage: `temperaturaOgniwC = ${temperaturaC} w [${ZAKRES_PRACY_MIN_C}, ${ZAKRES_PRACY_MAX_C}]`,
    field: "temperaturaOgniwC",
  }
}
