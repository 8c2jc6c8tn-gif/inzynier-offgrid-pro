import type { Warning } from "@/lib/core/calc-result"

export function wartoscPozaZakresem(field: string, labelKey: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { labelKey, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

/** Informacja: wynik dla tej lokalizacji/orientacji poza typowym zakresem źródła — nie błąd, tylko kontekst. */
export function pozaTypowymZakresem(stosunekPct: number, min: number, max: number): Warning {
  return {
    code: "WZ-POZA-TYPOWYM-ZAKRESEM",
    level: "info",
    i18nKey: "WZ-POZA-TYPOWYM-ZAKRESEM",
    params: { stosunek: Math.round(stosunekPct), min, max },
    technicalMessage: `stosunek E-W/S = ${stosunekPct.toFixed(1)}% poza [${min}, ${max}]`,
  }
}
