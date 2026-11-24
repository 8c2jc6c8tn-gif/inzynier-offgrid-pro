/**
 * Money fields of the screens whose drafts other screens read (`useOdczytDraftu`): the owner screen declares its amounts here,
 * and every reader converts them from the currency each was typed in (`lib/waluta/kwoty-pol.ts`). One list for both sides, so a
 * reader can never treat an amount in euro as złoty again (audit 3.2). Screens no one else reads declare `kwoty` inline.
 */
export const KWOTY_EKRANOW = {
  "oplacalnosc-magazynu": ["cenaBateriiZl", "kosztAlternatywyZlZaKwh"],
  "deficyty-miesieczne": ["cena", "serwis"],
} as const satisfies Record<string, readonly string[]>
