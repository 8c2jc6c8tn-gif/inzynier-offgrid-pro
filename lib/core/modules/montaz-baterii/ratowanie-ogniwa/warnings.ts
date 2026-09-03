import type { Warning } from "@/lib/core/calc-result"
import { NAPIECIE_ZASILACZA_RATUNKOWEGO_V, PRAD_LADOWANIA_RATUNKOWEGO_A } from "./constants"

/** 1:1 z cytatem 🔴 źródła. */
export function ogniwoZeroWoltowe(): Warning {
  return {
    code: "OGNIWO-ZERO-WOLTOWE",
    level: "critical",
    message:
      "Ogniwo ma 0 V. Prawdopodobnie doszło do przebicia separatora. Próba ładowania grozi pożarem. Zalecana utylizacja, nie ratunek.",
    technicalMessage: "napiecieOgniwaV = 0",
    field: "napiecieOgniwaV",
  }
}

export function ratunekOpcjonalnyNiezalecany(napiecieOgniwaV: number): Warning {
  return {
    code: "RATUNEK-OPCJONALNY-NIEZALECANY",
    level: "warning",
    message: `Napięcie ogniwa (${napiecieOgniwaV.toFixed(2)} V) jest niskie, ale niezerowe — ratunek jest opcjonalny i nie zalecany. Jeśli się zdecydujesz: zasilacz ${NAPIECIE_ZASILACZA_RATUNKOWEGO_V} V, limit prądu ${PRAD_LADOWANIA_RATUNKOWEGO_A} A, obserwuj temperaturę przez cały czas ładowania.`,
    technicalMessage: `0 < napiecieOgniwaV = ${napiecieOgniwaV} <= próg bezpiecznego ratunku`,
    field: "napiecieOgniwaV",
  }
}

export function proceduraStandardowegoRatunku(napiecieOgniwaV: number): Warning {
  return {
    code: "PROCEDURA-STANDARDOWEGO-RATUNKU",
    level: "info",
    message: `Napięcie ogniwa (${napiecieOgniwaV.toFixed(2)} V) pozwala na powolne ładowanie prądem 0,05C pod ścisłą obserwacją.`,
    technicalMessage: "napiecieOgniwaV powyżej progu bezpiecznego ratunku",
    field: "napiecieOgniwaV",
  }
}

export function napiecieUjemne(value: number): Warning {
  return {
    code: "NAPIECIE-OGNIWA-UJEMNE",
    level: "critical",
    message: 'Wartość pola "napięcie ogniwa" nie może być ujemna.',
    technicalMessage: `napiecieOgniwaV = ${value}, oczekiwano >= 0`,
    field: "napiecieOgniwaV",
  }
}
