import type { Warning } from "@/lib/core/calc-result"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function cosFiPozaZakresem(value: number): Warning {
  return {
    code: "COS-FI-POZA-ZAKRESEM",
    level: "critical",
    message: "Współczynnik mocy (cos φ) musi być z przedziału 0–1.",
    technicalMessage: `cosFi = ${value}, oczekiwano (0, 1]`,
    field: "cosFi",
  }
}

export function mocPozornaInfo(mocPozornaVA: number, mocCzynnaW: number): Warning {
  return {
    code: "MOC-POZORNA-INFO",
    level: "info",
    message: `Waty na tabliczce znamionowej to nie cała historia — to ${mocPozornaVA.toFixed(0)} VA, nie ${mocCzynnaW.toFixed(0)} W, realnie obciąża falownik.`,
    technicalMessage: `mocPozornaVA = ${mocPozornaVA}, mocCzynnaW = ${mocCzynnaW}`,
  }
}
