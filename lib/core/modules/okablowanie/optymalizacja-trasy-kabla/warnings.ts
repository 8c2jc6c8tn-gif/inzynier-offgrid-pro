import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function trasaNieSpelniaWymagan(oznaczenie: "A" | "B"): Warning {
  return {
    code: `TRASA-${oznaczenie}-NIE-SPELNIA-WYMAGAN`,
    level: "critical",
    i18nKey: "TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU",
    params: { oznaczenie },
    technicalMessage: `echo z dobor-przekroju-kabla dla trasy ${oznaczenie}`,
  }
}

export function porownanieKosztow(tanszaTrasa: "A" | "B", roznicaZl: number, liczbaLat: number): Warning {
  return {
    code: "POROWNANIE-KOSZTOW",
    level: "info",
    i18nKey: "POROWNANIE-KOSZTOW-TRAS",
    params: { tansza: tanszaTrasa, roznica: roznicaZl.toFixed(0), lata: liczbaLat },
    technicalMessage: `tanszaTrasa=${tanszaTrasa}, roznicaZl=${roznicaZl}`,
  }
}
