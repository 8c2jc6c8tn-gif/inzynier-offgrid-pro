import type { Warning } from "@/lib/core/calc-result"
import { PROG_ROZNICY_NAPIEC_V } from "./constants"

export function wartoscUjemna(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-UJEMNA`,
    level: "critical",
    message: `Wartość pola "${label}" nie może być ujemna.`,
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function roznicaNapiecZaDuza(roznicaV: number): Warning {
  return {
    code: "ROZNICA-NAPIEC-ZA-DUZA",
    level: "critical",
    message: `Różnica napięć między bateriami (${roznicaV.toFixed(2)} V) przekracza ${PROG_ROZNICY_NAPIEC_V} V — ryzyko iskrzenia w chwili połączenia.`,
    technicalMessage: `roznicaNapiecV = ${roznicaV} > PROG_ROZNICY_NAPIEC_V = ${PROG_ROZNICY_NAPIEC_V}`,
  }
}

export function innaChemiaBezIzolacji(chemia1: string, chemia2: string): Warning {
  return {
    code: "INNA-CHEMIA-BEZ-IZOLACJI",
    level: "critical",
    message: "Baterie mają różną chemię ogniw — mieszanie różnych chemii bez izolacji galwanicznej między nimi jest niebezpieczne.",
    technicalMessage: `chemia1 = "${chemia1}" !== chemia2 = "${chemia2}"`,
  }
}
