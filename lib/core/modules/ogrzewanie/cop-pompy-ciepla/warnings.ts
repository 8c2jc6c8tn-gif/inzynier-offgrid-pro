import type { Warning } from "@/lib/core/calc-result"
import { COP_MAX, COP_MIN, MOC_CIEPLNA_KW_MAX } from "./constants"

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    message: `Wartość pola "${label}" musi być większa od zera.`,
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function copOutOfRange(value: number): Warning {
  return {
    code: "COP-POZA-ZAKRESEM",
    level: "critical",
    message: `COP musi być z przedziału ${COP_MIN}–${COP_MAX} dla typowej pompy ciepła.`,
    technicalMessage: `cop = ${value}, oczekiwano [${COP_MIN}, ${COP_MAX}]`,
    field: "cop",
  }
}

export function mocCieplnaUnusuallyHigh(value: number): Warning {
  return {
    code: "MOC-CIEPLNA-NIETYPOWO-WYSOKA",
    level: "info",
    message: "To nietypowo wysoka wartość mocy cieplnej — sprawdź, czy nie pomyliłeś jednostek (kW, nie W).",
    technicalMessage: `mocCieplnaKw = ${value} > próg ${MOC_CIEPLNA_KW_MAX}`,
    field: "mocCieplnaKw",
  }
}
