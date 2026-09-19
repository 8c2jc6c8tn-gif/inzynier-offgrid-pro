import type { Warning } from "@/lib/core/calc-result"
import { LICZBA_PANELI_SANITY_MAX } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1). `validation.ts` decyduje, które zwrócić.
 *
 * `notPositive`/`notWholeNumber` nie przyjmują już etykiety pola po polsku (17.2) — treść z
 * etykietą jest zapisana raz na pole w słowniku (klucz = `code`, jednoznaczny per pole dzięki
 * `field.toUpperCase()`), nie składana z tłumaczonego parametru w runtime.
 */

export function notPositive(field: string, value: number): Warning {
  const code = `${field.toUpperCase()}-NIEDODATNI`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function notWholeNumber(field: string, value: number): Warning {
  const code = `${field.toUpperCase()}-NIE-CALKOWITA`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${field} = ${value}, oczekiwano liczby całkowitej`,
    field,
  }
}

export function liczbaPaneliUnusuallyHigh(value: number): Warning {
  return {
    code: "LICZBA-PANELI-NIETYPOWO-WYSOKA",
    level: "info",
    i18nKey: "LICZBA-PANELI-NIETYPOWO-WYSOKA",
    technicalMessage: `liczba paneli = ${value} > próg ${LICZBA_PANELI_SANITY_MAX}`,
    field: "liczbaPaneli",
  }
}
