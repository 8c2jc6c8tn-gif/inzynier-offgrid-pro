import type { Warning } from "@/lib/core/calc-result"

export function wartoscPozaZakresem(field: string, label: string, value: number, min: number, max: number): Warning {
  return {
    code: `${field.toUpperCase()}-POZA-ZAKRESEM`,
    level: "critical",
    i18nKey: "WARTOSC-POZA-ZAKRESEM",
    params: { label, min, max },
    technicalMessage: `${field} = ${value}, oczekiwano [${min}, ${max}]`,
    field,
  }
}

export function wartoscUjemna(field: string, label: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-UJEMNA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function prPozaZakresem(value: number): Warning {
  return {
    code: "KAT-PR-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "KAT-PR-POZA-ZAKRESEM",
    technicalMessage: `wspolczynnikPr = ${value}, oczekiwano (0, 1]`,
    field: "wspolczynnikPr",
  }
}

/** Informacja: bez mocy i PR ekran pokazuje nasłonecznienie, nie produkcję (źródło mówi o kWh). */
export function produkcjaWymagaMocyIPr(): Warning {
  return {
    code: "KAT-PRODUKCJA-WYMAGA-MOCY-I-PR",
    level: "info",
    i18nKey: "KAT-PRODUKCJA-WYMAGA-MOCY-I-PR",
    technicalMessage: "mocInstalacjiKwp = 0 lub wspolczynnikPr = null — produkcja kWh nieliczona",
  }
}
