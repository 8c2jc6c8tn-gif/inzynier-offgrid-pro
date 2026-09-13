import type { Warning } from "@/lib/core/calc-result"
import { MAX_OGNIW, MIN_OGNIW } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function nieparzystaLiczbaOgniw(liczbaOgniw: number): Warning {
  return {
    code: "NIEPARZYSTA-LICZBA-OGNIW",
    level: "critical",
    message: `${liczbaOgniw} ogniw nie da się ułożyć w dwóch równych rzędach — układ opisany w źródle wymaga parzystej liczby ogniw.`,
    technicalMessage: `liczbaOgniw=${liczbaOgniw} jest nieparzysta`,
  }
}

export function zaMaloOgniw(liczbaOgniw: number): Warning {
  return {
    code: "ZA-MALO-OGNIW",
    level: "critical",
    message: `Minimum ${MIN_OGNIW} ogniwa — poniżej tego układ dwurzędowy nie ma sensu.`,
    technicalMessage: `liczbaOgniw=${liczbaOgniw} < ${MIN_OGNIW}`,
  }
}

export function zaDuzoOgniw(liczbaOgniw: number): Warning {
  return {
    code: "ZA-DUZO-OGNIW",
    level: "critical",
    message: `Powyżej ${MAX_OGNIW} ogniw źródło nie opisuje już tego układu — sprawdź specyfikę swojego BMS/obudowy ręcznie.`,
    technicalMessage: `liczbaOgniw=${liczbaOgniw} > ${MAX_OGNIW}`,
  }
}
