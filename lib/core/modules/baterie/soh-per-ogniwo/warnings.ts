import type { Warning } from "@/lib/core/calc-result"
import { PROG_KRYTYCZNY_WZROSTU_PCT } from "./constants"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function ogniwoDoWymiany(wzrostPct: number): Warning {
  return {
    code: "OGNIWO-DO-WYMIANY",
    level: "critical",
    message: `Rezystancja wewnętrzna wzrosła o ${wzrostPct.toFixed(0)}% względem wartości fabrycznej (próg krytyczny: ${PROG_KRYTYCZNY_WZROSTU_PCT}%) — to ogniwo straciło znaczącą część pojemności, wymień je.`,
    technicalMessage: `wzrostPct = ${wzrostPct} >= PROG_KRYTYCZNY_WZROSTU_PCT = ${PROG_KRYTYCZNY_WZROSTU_PCT}`,
  }
}

export function ogniwoOk(wzrostPct: number): Warning {
  return {
    code: "OGNIWO-OK",
    level: "info",
    message: `Rezystancja wewnętrzna wzrosła o ${wzrostPct.toFixed(0)}% względem wartości fabrycznej — poniżej progu krytycznego (${PROG_KRYTYCZNY_WZROSTU_PCT}%).`,
    technicalMessage: `wzrostPct = ${wzrostPct} < PROG_KRYTYCZNY_WZROSTU_PCT = ${PROG_KRYTYCZNY_WZROSTU_PCT}`,
  }
}
