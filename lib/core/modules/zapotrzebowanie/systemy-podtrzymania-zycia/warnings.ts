import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 */

export function selectedItemNotPositive(label: string, value: number): Warning {
  return {
    code: "POZYCJA-NIEDODATNIA",
    level: "critical",
    message: `Zaznaczona pozycja "${label}" musi mieć moc większą od zera.`,
    technicalMessage: `powerW = ${value} dla zaznaczonej pozycji "${label}", oczekiwano > 0`,
    field: "items",
  }
}

export function nothingSelected(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    message: "Nie zaznaczono żadnego odbiornika krytycznego.",
    technicalMessage: "items.filter(selected).length === 0",
    field: "items",
  }
}
