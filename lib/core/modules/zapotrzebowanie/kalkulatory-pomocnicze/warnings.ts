import type { Warning } from "@/lib/core/calc-result"
import { EFFICIENCY_LOW_WARNING_THRESHOLD, EFFICIENCY_MAX, EFFICIENCY_MIN, POWER_W_SANITY_MAX } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1: kod/poziom/komunikat user/
 * komunikat techniczny/pole). `validation.ts` tylko decyduje, które z nich zwrócić.
 *
 * Zmigrowane do i18n (docs/standards/17-i18n.md, pilotaż 15.09.2026, patrz docs/memory.md) —
 * bez `message`, treść dla użytkownika w `lib/i18n/dictionary-pl.ts`, rozwiązywana przez
 * `lib/i18n/t(i18nKey ?? code, params)` w warstwie prezentacji.
 */

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

export function efficiencyOutOfRange(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    technicalMessage: `efficiency = ${value}, oczekiwano (${EFFICIENCY_MIN}, ${EFFICIENCY_MAX}]`,
    field: "efficiency",
  }
}

export function efficiencyUnusuallyLow(value: number): Warning {
  return {
    code: "SPRAWNOSC-NISKA",
    level: "warning",
    technicalMessage: `efficiency = ${value} < próg ${EFFICIENCY_LOW_WARNING_THRESHOLD}`,
    field: "efficiency",
  }
}

export function powerUnusuallyHigh(value: number): Warning {
  return {
    code: "MOC-NIETYPOWO-WYSOKA",
    level: "info",
    technicalMessage: `powerW = ${value} > próg ${POWER_W_SANITY_MAX}`,
    field: "powerW",
  }
}
