import type { Warning } from "@/lib/core/calc-result"

export function poborUjemny(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "POBOR-UJEMNY",
    level: "critical",
    i18nKey: "POBOR-UJEMNY",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}
