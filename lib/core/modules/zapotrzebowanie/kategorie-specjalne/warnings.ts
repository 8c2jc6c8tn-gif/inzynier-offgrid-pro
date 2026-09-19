import type { Warning } from "@/lib/core/calc-result"

export function pozycjaNiedodatnia(nazwa: string, value: number): Warning {
  return {
    code: "POZYCJA-NIEDODATNIA",
    level: "critical",
    i18nKey: "POZYCJA-NIEDODATNIA",
    params: { label: nazwa },
    technicalMessage: `wartość = ${value} dla pozycji "${nazwa}", oczekiwano > 0`,
    field: "pozycje",
  }
}

export function brakPozycji(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "BRAK-ZAZNACZONYCH",
    technicalMessage: "pozycje.length === 0",
    field: "pozycje",
  }
}
