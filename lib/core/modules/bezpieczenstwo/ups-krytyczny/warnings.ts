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

export function brakZaznaczonych(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "BRAK-ZAZNACZONYCH-URZADZEN",
    technicalMessage: "selected.length === 0",
  }
}

export function czasPodtrzymaniaInfo(czasPodtrzymaniaH: number): Warning {
  return {
    code: "CZAS-PODTRZYMANIA",
    level: "info",
    i18nKey: "CZAS-PODTRZYMANIA",
    params: { czas: czasPodtrzymaniaH.toFixed(2) },
    technicalMessage: `czasPodtrzymaniaH=${czasPodtrzymaniaH}`,
  }
}
