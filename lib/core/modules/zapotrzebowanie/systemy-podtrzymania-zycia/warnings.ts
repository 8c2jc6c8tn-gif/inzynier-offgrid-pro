import type { Warning } from "@/lib/core/calc-result"

/**
 * Katalog ostrzeżeń tego kalkulatora — jedno miejsce prawdy dla treści komunikatów
 * (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1).
 *
 * Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, treść dla użytkownika w
 * `lib/i18n/dictionary-*.ts`, rozwiązywana przez `lib/i18n/t(i18nKey ?? code, params)`.
 */

export function selectedItemNotPositive(label: string, value: number): Warning {
  return {
    code: "POZYCJA-NIEDODATNIA",
    level: "critical",
    i18nKey: "POZYCJA-NIEDODATNIA",
    params: { label },
    technicalMessage: `powerW = ${value} dla zaznaczonej pozycji "${label}", oczekiwano > 0`,
    field: "items",
  }
}

export function nothingSelected(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "BRAK-ZAZNACZONYCH",
    technicalMessage: "items.filter(selected).length === 0",
    field: "items",
  }
}
