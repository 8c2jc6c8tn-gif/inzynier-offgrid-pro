import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(pole: string, etykieta: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label: etykieta },
    technicalMessage: `${pole} = ${value}, oczekiwano >= 0`,
    field: pole,
  }
}

export function dodPozaZakresem(value: number): Warning {
  return {
    code: "DOD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "DOD-POZA-ZAKRESEM",
    technicalMessage: `dodPct = ${value}, oczekiwano [0, 100]`,
    field: "dodPct",
  }
}

export function sprawnoscPozaZakresem(value: number): Warning {
  return {
    code: "SPRAWNOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "SPRAWNOSC-PROCENT-POZA-ZAKRESEM",
    technicalMessage: `sprawnoscPct = ${value}, oczekiwano [0, 100]`,
    field: "sprawnoscPct",
  }
}
