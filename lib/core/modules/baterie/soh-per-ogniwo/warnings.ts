import type { Warning } from "@/lib/core/calc-result"
import { PROG_KRYTYCZNY_WZROSTU_PCT } from "./constants"

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

export function ogniwoDoWymiany(wzrostPct: number): Warning {
  return {
    code: "OGNIWO-DO-WYMIANY",
    level: "critical",
    i18nKey: "OGNIWO-DO-WYMIANY",
    params: { wzrost: wzrostPct.toFixed(0), prog: PROG_KRYTYCZNY_WZROSTU_PCT },
    technicalMessage: `wzrostPct = ${wzrostPct} >= PROG_KRYTYCZNY_WZROSTU_PCT = ${PROG_KRYTYCZNY_WZROSTU_PCT}`,
  }
}

export function ogniwoOk(wzrostPct: number): Warning {
  return {
    code: "OGNIWO-OK",
    level: "info",
    i18nKey: "OGNIWO-OK",
    params: { wzrost: wzrostPct.toFixed(0), prog: PROG_KRYTYCZNY_WZROSTU_PCT },
    technicalMessage: `wzrostPct = ${wzrostPct} < PROG_KRYTYCZNY_WZROSTU_PCT = ${PROG_KRYTYCZNY_WZROSTU_PCT}`,
  }
}
