import type { Warning } from "@/lib/core/calc-result"
import { COP_POMPY_MIN, COP_POMPY_MAX } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    message: "Wartość nie może być ujemna.",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function copPozaZakresem(value: number): Warning {
  return {
    code: "COP-POZA-ZAKRESEM",
    level: "critical",
    message: `COP musi być z przedziału ${COP_POMPY_MIN}-${COP_POMPY_MAX} dla typowej pompy ciepła.`,
    technicalMessage: `copPompy = ${value}, oczekiwano [${COP_POMPY_MIN}, ${COP_POMPY_MAX}]`,
    field: "copPompy",
  }
}

export function oszczednoscInfo(oszczednoscZl: number, mnoznikZuzycia: number): Warning {
  return {
    code: "OSZCZEDNOSC",
    level: "info",
    message: `Pompa ciepła jest tańsza o ${oszczednoscZl.toFixed(2)} zł — kocioł elektryczny zużyje ${mnoznikZuzycia.toFixed(1)}× więcej prądu na to samo ciepło.`,
    technicalMessage: `oszczednoscZl=${oszczednoscZl}, mnoznikZuzycia=${mnoznikZuzycia}`,
  }
}
