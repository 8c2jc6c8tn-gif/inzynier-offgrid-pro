import type { Warning } from "@/lib/core/calc-result"
import { PROG_TOP_BALANCING_V } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 */

export function pojemnoscNiedodatnia(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    message: "Pojemność pakietu musi być większa od zera.",
    technicalMessage: `pojemnoscAh = ${value}, oczekiwano > 0`,
    field: "pojemnoscAh",
  }
}

export function napiecieOgniwaUjemne(value: number): Warning {
  return {
    code: "NAPIECIE-OGNIWA-UJEMNE",
    level: "critical",
    message: "Napięcie ogniwa nie może być ujemne.",
    technicalMessage: `napiecieNajwyzszegoOgniwaV = ${value}, oczekiwano >= 0`,
    field: "napiecieNajwyzszegoOgniwaV",
  }
}

/** Info-level (Dyrektywa #6, docs/memory.md) — kamień milowy jeszcze nieosiągnięty, nie ryzyko. */
export function topBalancingNieosiagniety(napiecieV: number): Warning {
  return {
    code: "TOP-BALANCING-NIEOSIAGNIETY",
    level: "info",
    message: `Napięcie najwyższego ogniwa (${napiecieV.toFixed(2)} V) jeszcze nie osiągnęło progu Top Balancing (${PROG_TOP_BALANCING_V} V) — kontynuuj ładowanie małym prądem.`,
    technicalMessage: `napiecieNajwyzszegoOgniwaV=${napiecieV} < PROG_TOP_BALANCING_V=${PROG_TOP_BALANCING_V}`,
    field: "napiecieNajwyzszegoOgniwaV",
  }
}
