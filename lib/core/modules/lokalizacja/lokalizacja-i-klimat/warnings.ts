import type { Warning } from "@/lib/core/calc-result"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function outOfRange(field: string, labelKey: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}
