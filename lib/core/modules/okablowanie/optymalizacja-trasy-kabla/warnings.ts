import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function trasaNieSpelniaWymagan(oznaczenie: "A" | "B", komunikat: string): Warning {
  return {
    code: `TRASA-${oznaczenie}-NIE-SPELNIA-WYMAGAN`,
    level: "critical",
    message: `Trasa ${oznaczenie}: ${komunikat}`,
    technicalMessage: `echo z dobor-przekroju-kabla dla trasy ${oznaczenie}`,
  }
}

export function porownanieKosztow(tanszaTrasa: "A" | "B", roznicaZl: number, liczbaLat: number): Warning {
  return {
    code: "POROWNANIE-KOSZTOW",
    level: "info",
    message: `Po ${liczbaLat} latach trasa ${tanszaTrasa} jest tańsza o ${roznicaZl.toFixed(0)} zł (koszt zakupu + straty energii razem).`,
    technicalMessage: `tanszaTrasa=${tanszaTrasa}, roznicaZl=${roznicaZl}`,
  }
}
