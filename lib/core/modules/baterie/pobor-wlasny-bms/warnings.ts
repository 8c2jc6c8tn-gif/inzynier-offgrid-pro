import type { Warning } from "@/lib/core/calc-result"

export function poborUjemny(pole: string, value: number): Warning {
  const code = `${pole.toUpperCase()}-UJEMNY`
  return {
    code,
    level: "critical",
    i18nKey: code,
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}
