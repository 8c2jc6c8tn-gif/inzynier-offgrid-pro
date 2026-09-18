import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function tolerancjaPozaZakresem(value: number): Warning {
  return {
    code: "TOLERANCJA-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "TOLERANCJA-POZA-ZAKRESEM",
    technicalMessage: `tolerancjaPct = ${value}, oczekiwano [0, 100]`,
    field: "tolerancjaPct",
  }
}

export function pojemnoscOgraniczonaNajslabszym(utrataPct: number): Warning {
  return {
    code: "POJEMNOSC-OGRANICZONA-NAJSLABSZYM",
    level: "info",
    i18nKey: "POJEMNOSC-OGRANICZONA-NAJSLABSZYM",
    params: { utrata: utrataPct.toFixed(1) },
    technicalMessage: `utrataPct = ${utrataPct}`,
  }
}
