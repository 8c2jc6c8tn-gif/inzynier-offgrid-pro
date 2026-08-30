import type { Warning } from "@/lib/core/calc-result"
import { LICZBA_PANELI_SANITY_MAX } from "./constants"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1). `validation.ts` decyduje, które zwrócić.
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

export function notWholeNumber(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIE-CALKOWITA`,
    level: "critical",
    message: `Wartość pola "${label}" musi być liczbą całkowitą — nie da się podłączyć ułamka panelu.`,
    technicalMessage: `${field} = ${value}, oczekiwano liczby całkowitej`,
    field,
  }
}

export function liczbaPaneliUnusuallyHigh(value: number): Warning {
  return {
    code: "LICZBA-PANELI-NIETYPOWO-WYSOKA",
    level: "info",
    message: "To nietypowo duża liczba paneli w jednym stringu — sprawdź, czy to zamierzone.",
    technicalMessage: `liczba paneli = ${value} > próg ${LICZBA_PANELI_SANITY_MAX}`,
    field: "liczbaPaneli",
  }
}
