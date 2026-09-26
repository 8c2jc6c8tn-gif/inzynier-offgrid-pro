import type { Warning } from "@/lib/core/calc-result"

export { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "../obciazenie-cieplne/warnings"

/** Hot water not warmer than cold water — no heating need, the input is almost certainly wrong. */
export function cwuNieCieplejsza(tCwu: number, tZimna: number): Warning {
  return {
    code: "COCWU-CWU-NIE-CIEPLEJSZA",
    level: "critical",
    i18nKey: "COCWU-CWU-NIE-CIEPLEJSZA",
    params: { tCwu, tZimna },
    technicalMessage: `temperaturaCwuC = ${tCwu} <= temperaturaZimnejWodyC = ${tZimna}`,
    field: "temperaturaCwuC",
  }
}

/** No monthly space-heating heat from E1 — only C.W.U. is shown. */
export function brakMiesiecyCo(): Warning {
  return {
    code: "COCWU-BRAK-MIESIECY-CO",
    level: "info",
    i18nKey: "COCWU-BRAK-MIESIECY-CO",
    technicalMessage: "cieploCoMiesiaceKwh puste — Ekran 1 bez średnich temperatur miesięcy",
  }
}

/** C.W.U. = heating the water only — circulation and tank standing losses (E17) are not included. */
export function cwuBezStratZasobnika(): Warning {
  return {
    code: "COCWU-CWU-BEZ-STRAT",
    level: "info",
    i18nKey: "COCWU-CWU-BEZ-STRAT",
    technicalMessage: "E_CWU = V·ΔT·c — bez strat postojowych zasobnika i cyrkulacji (M6/E17)",
  }
}
