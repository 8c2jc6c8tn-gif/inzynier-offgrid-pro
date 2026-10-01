import type { Warning } from "@/lib/core/calc-result"

/**
 * Input checks shared by the Module 6 screens built on 01.10.2026 (E13, E16–E20, 5.42, 2A) — the same
 * idea as `kalkulator-mobilny/wspolne/walidacja.ts`: one translated message per rule, the field name goes
 * to `field` and `technicalMessage`. These are form validation, not engineering facts — covered in
 * `scripts/stopy-guard-wyjatki.json` by the `*-UJEMNA` / `*-POZA-ZAKRESEM` patterns.
 */

/** Every listed numeric field must be >= 0 (0 = not entered yet). */
export function ujemneWartosci(pola: Record<string, number>): Warning[] {
  return Object.entries(pola)
    .filter(([, wartosc]) => wartosc < 0)
    .map(([pole, wartosc]) => ({
      code: "M6-WARTOSC-UJEMNA",
      level: "critical",
      i18nKey: "M6-WARTOSC-UJEMNA",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
      field: pole,
    }))
}

/** Hours per day outside [0, 24]. */
export function godzinyPozaDoba(pole: string, wartosc: number): Warning[] {
  if (wartosc >= 0 && wartosc <= 24) return []
  return [
    {
      code: "M6-GODZINY-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "M6-GODZINY-POZA-ZAKRESEM",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, 24]`,
      field: pole,
    },
  ]
}

/** A percentage field outside [0, 100]. */
export function procentPozaZakresem(pole: string, wartosc: number): Warning[] {
  if (wartosc >= 0 && wartosc <= 100) return []
  return [
    {
      code: "M6-PROCENT-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "M6-PROCENT-POZA-ZAKRESEM",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, 100]`,
      field: pole,
    },
  ]
}

/** A COP below 1 (0 = not entered yet is allowed) — even a resistive heater turns 1 kWh into 1 kWh of heat. */
export function copPonizejJednosci(pole: string, wartosc: number): Warning[] {
  if (wartosc === 0 || wartosc >= 1) return []
  return [
    {
      code: "M6-COP-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "M6-COP-POZA-ZAKRESEM",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano 0 (nie wpisano) albo >= 1`,
      field: pole,
    },
  ]
}
