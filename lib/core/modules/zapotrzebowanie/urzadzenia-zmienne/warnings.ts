import type { Warning } from "@/lib/core/calc-result"

export function pozycjaNiedodatnia(label: string, value: number): Warning {
  return {
    code: "POZYCJA-NIEDODATNIA",
    level: "critical",
    i18nKey: "POZYCJA-NIEDODATNIA",
    params: { label },
    technicalMessage: `mocW = ${value} dla zaznaczonej pozycji "${label}", oczekiwano > 0`,
    field: "urzadzenia",
  }
}

export function brakZaznaczonych(): Warning {
  return {
    code: "BRAK-ZAZNACZONYCH",
    level: "warning",
    i18nKey: "BRAK-ZAZNACZONYCH",
    technicalMessage: "urzadzenia.filter(wybrane).length === 0 && !plytaIndukcyjnaWybrana",
    field: "urzadzenia",
  }
}

export function sugerowanaWymianaStarych(nazwyUrzadzen: string): Warning {
  return {
    code: "SUGEROWANA-WYMIANA-STARYCH-URZADZEN",
    level: "info",
    i18nKey: "SUGEROWANA-WYMIANA-STARYCH-URZADZEN",
    params: { urzadzenia: nazwyUrzadzen },
    technicalMessage: `urządzenia klasy "stare" (mnożnik 1,4): ${nazwyUrzadzen}`,
  }
}
