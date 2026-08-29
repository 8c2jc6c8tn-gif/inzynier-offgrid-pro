import type { Warning } from "@/lib/core/calc-result"
import { EFFICIENCY_LOW_WARNING_THRESHOLD, EFFICIENCY_MAX, EFFICIENCY_MIN, POWER_W_SANITY_MAX } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1: kod/poziom/komunikat user/
 * komunikat techniczny/pole). `validation.ts` tylko decyduje, które z nich zwrócić.
 */

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function efficiencyOutOfRange(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    message: "Sprawność musi być liczbą z przedziału (0, 1].",
    technicalMessage: `efficiency = ${value}, oczekiwano (${EFFICIENCY_MIN}, ${EFFICIENCY_MAX}]`,
    field: "efficiency",
  }
}

export function efficiencyUnusuallyLow(value: number): Warning {
  return {
    code: "SPRAWNOSC-NISKA",
    level: "warning",
    message: "Podana sprawność jest nietypowo niska — sprawdź, czy nie pomyliłeś jednostek.",
    technicalMessage: `efficiency = ${value} < próg ${EFFICIENCY_LOW_WARNING_THRESHOLD}`,
    field: "efficiency",
  }
}

export function powerUnusuallyHigh(value: number): Warning {
  return {
    code: "MOC-NIETYPOWO-WYSOKA",
    level: "info",
    message: "To nietypowo wysoka wartość mocy — sprawdź, czy nie pomyliłeś jednostek.",
    technicalMessage: `powerW = ${value} > próg ${POWER_W_SANITY_MAX}`,
    field: "powerW",
  }
}
