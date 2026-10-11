import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return { code: "PROGMIES-WARTOSC-UJEMNA", level: "critical", i18nKey: "PROGMIES-WARTOSC-UJEMNA", technicalMessage: `${field} = ${value}, oczekiwano >= 0`, field }
}

export function wartoscPozaZakresem(field: string, value: number, min: number, max: number): Warning {
  return {
    code: "PROGMIES-WARTOSC-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "PROGMIES-WARTOSC-POZA-ZAKRESEM",
    params: { min, max },
    technicalMessage: `${field} = ${value}, oczekiwano ${min}…${max}`,
    field,
  }
}

/** Months without a production value: their forecast is empty, not zero. */
export function brakMiesiecy(liczba: number): Warning {
  return {
    code: "PROGMIES-BRAK-MIESIECY",
    level: "warning",
    i18nKey: "PROGMIES-BRAK-MIESIECY",
    params: { liczba },
    technicalMessage: `Brak produkcji z ${liczba} mies. historii — prognoza tych miesięcy pusta`,
  }
}

export function brakDegradacji(): Warning {
  return {
    code: "PROGMIES-BRAK-DEGRADACJI",
    level: "info",
    i18nKey: "PROGMIES-BRAK-DEGRADACJI",
    technicalMessage: "Nie wpisano rocznej degradacji paneli — liczona jako 0 %",
  }
}
