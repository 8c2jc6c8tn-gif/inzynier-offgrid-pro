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

export function cosFiPozaZakresem(value: number): Warning {
  return {
    code: "COS-FI-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "COS-FI-POZA-ZAKRESEM",
    technicalMessage: `cosFi = ${value}, oczekiwano (0, 1]`,
    field: "cosFi",
  }
}

export function mocPozornaInfo(mocPozornaVA: number, mocCzynnaW: number): Warning {
  return {
    code: "MOC-POZORNA-INFO",
    level: "info",
    i18nKey: "MOC-POZORNA-INFO",
    params: { va: mocPozornaVA.toFixed(0), w: mocCzynnaW.toFixed(0) },
    technicalMessage: `mocPozornaVA = ${mocPozornaVA}, mocCzynnaW = ${mocCzynnaW}`,
  }
}
