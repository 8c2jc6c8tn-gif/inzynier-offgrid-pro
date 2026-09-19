import type { Warning } from "@/lib/core/calc-result"
import { MAX_OGNIW, MIN_OGNIW } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function nieparzystaLiczbaOgniw(liczbaOgniw: number): Warning {
  return {
    code: "NIEPARZYSTA-LICZBA-OGNIW",
    level: "critical",
    i18nKey: "NIEPARZYSTA-LICZBA-OGNIW",
    params: { liczba: liczbaOgniw },
    technicalMessage: `liczbaOgniw=${liczbaOgniw} jest nieparzysta`,
  }
}

export function zaMaloOgniw(liczbaOgniw: number): Warning {
  return {
    code: "ZA-MALO-OGNIW",
    level: "critical",
    i18nKey: "ZA-MALO-OGNIW",
    params: { min: MIN_OGNIW },
    technicalMessage: `liczbaOgniw=${liczbaOgniw} < ${MIN_OGNIW}`,
  }
}

export function zaDuzoOgniw(liczbaOgniw: number): Warning {
  return {
    code: "ZA-DUZO-OGNIW",
    level: "critical",
    i18nKey: "ZA-DUZO-OGNIW",
    params: { max: MAX_OGNIW },
    technicalMessage: `liczbaOgniw=${liczbaOgniw} > ${MAX_OGNIW}`,
  }
}
