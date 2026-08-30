import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 */

export function pojemnoscNotPositive(value: number): Warning {
  return {
    code: "POJEMNOSC-NIEDODATNIA",
    level: "critical",
    message: 'Wartość pola "planowana pojemność" musi być większa od zera.',
    technicalMessage: `pojemnoscKwh = ${value}, oczekiwano > 0`,
    field: "pojemnoscKwh",
  }
}
