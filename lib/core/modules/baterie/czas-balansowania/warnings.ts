import type { Warning } from "@/lib/core/calc-result"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "CB-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "CB-WARTOSC-UJEMNA",
    technicalMessage: `${field} = ${value}, expected >= 0`,
    field,
  }
}

export function rozjazdPozaZakresem(value: number): Warning {
  return {
    code: "CB-ROZJAZD-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "CB-ROZJAZD-POZA-ZAKRESEM",
    technicalMessage: `rozjazdProc = ${value}, expected (0, 100]`,
    field: "rozjazdProc",
  }
}

export function oknoPozaZakresem(value: number): Warning {
  return {
    code: "CB-OKNO-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "CB-OKNO-POZA-ZAKRESEM",
    technicalMessage: `oknoGodzinDobe = ${value}, expected [0, 24]`,
    field: "oknoGodzinDobe",
  }
}

/** More than one day of the window is needed: the mismatch will not be evened out in one day. */
export function wieleDni(dni: number, okno: number): Warning {
  return {
    code: "CB-WIELE-DNI",
    level: "warning",
    i18nKey: "CB-WIELE-DNI",
    params: { dni, okno },
    technicalMessage: `balancing needs ${dni} days with a ${okno} h window above the start voltage`,
  }
}

export function brakOkna(): Warning {
  return {
    code: "CB-BRAK-OKNA",
    level: "info",
    i18nKey: "CB-BRAK-OKNA",
    technicalMessage: "oknoGodzinDobe not entered: only the balancer run time is shown",
  }
}
