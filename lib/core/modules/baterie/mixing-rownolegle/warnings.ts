import type { Warning } from "@/lib/core/calc-result"
import { PROG_ROZNICY_NAPIEC_V } from "./constants"

export function wartoscUjemna(field: string, labelKey: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-UJEMNA`,
    level: "critical",
    i18nKey: "WARTOSC-POLA-UJEMNA",
    params: { labelKey },
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function roznicaNapiecZaDuza(roznicaV: number): Warning {
  return {
    code: "ROZNICA-NAPIEC-ZA-DUZA",
    level: "critical",
    i18nKey: "ROZNICA-NAPIEC-ZA-DUZA",
    params: { roznica: roznicaV.toFixed(2), prog: PROG_ROZNICY_NAPIEC_V },
    technicalMessage: `roznicaNapiecV = ${roznicaV} > PROG_ROZNICY_NAPIEC_V = ${PROG_ROZNICY_NAPIEC_V}`,
  }
}

export function innaChemiaBezIzolacji(chemia1: string, chemia2: string): Warning {
  return {
    code: "INNA-CHEMIA-BEZ-IZOLACJI",
    level: "critical",
    i18nKey: "INNA-CHEMIA-BEZ-IZOLACJI",
    technicalMessage: `chemia1 = "${chemia1}" !== chemia2 = "${chemia2}"`,
  }
}
