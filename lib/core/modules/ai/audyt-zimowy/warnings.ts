import type { Warning } from "@/lib/core/calc-result"
import { KOD_NIEGOTOWE, type PozycjaAudytu } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "AZIM-WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, expected >= 0`,
    field,
  }
}

export function pozycjaNiegotowa(pozycja: PozycjaAudytu): Warning {
  return {
    code: KOD_NIEGOTOWE[pozycja],
    level: "warning",
    technicalMessage: `winter audit item not ready: ${pozycja}`,
    field: pozycja,
  }
}

export function brakujePaliwa(brakL: number, zapasL: number, wymaganyL: number): Warning {
  return {
    code: "AZIM-PALIWA-BRAKUJE",
    level: "warning",
    params: { brak: Math.round(brakL * 10) / 10, zapas: zapasL, wymagany: wymaganyL },
    technicalMessage: `fuel ${zapasL} l < needed ${wymaganyL} l`,
    field: "zapasPaliwaL",
  }
}
