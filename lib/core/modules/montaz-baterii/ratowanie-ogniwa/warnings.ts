import type { Warning } from "@/lib/core/calc-result"
import { NAPIECIE_ZASILACZA_RATUNKOWEGO_V, PRAD_LADOWANIA_RATUNKOWEGO_A } from "./constants"

/** 1:1 z cytatem 🔴 źródła. */
export function ogniwoZeroWoltowe(): Warning {
  return {
    code: "OGNIWO-ZERO-WOLTOWE",
    level: "critical",
    i18nKey: "OGNIWO-ZERO-WOLTOWE",
    technicalMessage: "napiecieOgniwaV = 0",
    field: "napiecieOgniwaV",
  }
}

export function ratunekOpcjonalnyNiezalecany(napiecieOgniwaV: number): Warning {
  return {
    code: "RATUNEK-OPCJONALNY-NIEZALECANY",
    level: "warning",
    i18nKey: "RATUNEK-OPCJONALNY-NIEZALECANY",
    params: {
      napiecie: napiecieOgniwaV.toFixed(2),
      zasilacz: NAPIECIE_ZASILACZA_RATUNKOWEGO_V,
      prad: PRAD_LADOWANIA_RATUNKOWEGO_A,
    },
    technicalMessage: `0 < napiecieOgniwaV = ${napiecieOgniwaV} <= próg bezpiecznego ratunku`,
    field: "napiecieOgniwaV",
  }
}

export function proceduraStandardowegoRatunku(napiecieOgniwaV: number): Warning {
  return {
    code: "PROCEDURA-STANDARDOWEGO-RATUNKU",
    level: "info",
    i18nKey: "PROCEDURA-STANDARDOWEGO-RATUNKU",
    params: { napiecie: napiecieOgniwaV.toFixed(2) },
    technicalMessage: "napiecieOgniwaV powyżej progu bezpiecznego ratunku",
    field: "napiecieOgniwaV",
  }
}

export function napiecieUjemne(value: number): Warning {
  return {
    code: "NAPIECIE-OGNIWA-UJEMNE",
    level: "critical",
    i18nKey: "NAPIECIE-OGNIWA-POLE-UJEMNE",
    technicalMessage: `napiecieOgniwaV = ${value}, oczekiwano >= 0`,
    field: "napiecieOgniwaV",
  }
}
