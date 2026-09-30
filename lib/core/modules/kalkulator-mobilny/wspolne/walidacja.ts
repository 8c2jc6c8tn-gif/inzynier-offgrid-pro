import type { Warning } from "@/lib/core/calc-result"

/**
 * Input checks shared by the Module 12 screens built on 30.09.2026 (E4, E16, E35 and later). One
 * translated message per rule instead of a Polish field label in `params` — the field name goes to
 * `field` (the UI marks the input) and to `technicalMessage`.
 */

/** Every listed numeric field must be >= 0 (0 = not entered yet). */
export function ujemneWartosci(pola: Record<string, number>): Warning[] {
  return Object.entries(pola)
    .filter(([, wartosc]) => wartosc < 0)
    .map(([pole, wartosc]) => ({
      code: "M12-WARTOSC-UJEMNA",
      level: "critical",
      i18nKey: "M12-WARTOSC-UJEMNA",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano >= 0`,
      field: pole,
    }))
}

/** A percentage field outside [0, 100]. */
export function procentPozaZakresem(pole: string, wartosc: number): Warning[] {
  if (wartosc >= 0 && wartosc <= 100) return []
  return [
    {
      code: "M12-PROCENT-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "M12-PROCENT-POZA-ZAKRESEM",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano [0, 100]`,
      field: pole,
    },
  ]
}

/** Hours per day outside [0, 24]. */
export function godzinyPonadDobe(pole: string, wartosc: number): Warning[] {
  if (wartosc <= 24) return []
  return [
    {
      code: "M12-GODZINY-PONAD-DOBE",
      level: "critical",
      i18nKey: "M12-GODZINY-PONAD-DOBE",
      technicalMessage: `${pole} = ${wartosc}, oczekiwano <= 24`,
      field: pole,
    },
  ]
}
