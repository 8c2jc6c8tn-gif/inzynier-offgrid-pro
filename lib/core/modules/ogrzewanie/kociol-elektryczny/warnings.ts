import type { Warning } from "@/lib/core/calc-result"
import { COP_POMPY_MIN, COP_POMPY_MAX } from "./constants"

export function wartoscUjemna(field: string, value: number): Warning {
  return {
    code: "WARTOSC-UJEMNA",
    level: "critical",
    i18nKey: "WARTOSC-NIE-MOZE-BYC-UJEMNA",
    technicalMessage: `${field} = ${value}, oczekiwano >= 0`,
    field,
  }
}

export function copPozaZakresem(value: number): Warning {
  return {
    code: "COP-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "COP-POZA-ZAKRESEM",
    params: { min: COP_POMPY_MIN, max: COP_POMPY_MAX },
    technicalMessage: `copPompy = ${value}, oczekiwano [${COP_POMPY_MIN}, ${COP_POMPY_MAX}]`,
    field: "copPompy",
  }
}

export function oszczednoscInfo(oszczednoscZl: number, mnoznikZuzycia: number): Warning {
  return {
    code: "OSZCZEDNOSC",
    level: "info",
    i18nKey: "OSZCZEDNOSC-KOCIOL-VS-POMPA",
    params: { oszczednosc: oszczednoscZl.toFixed(2), mnoznik: mnoznikZuzycia.toFixed(1) },
    technicalMessage: `oszczednoscZl=${oszczednoscZl}, mnoznikZuzycia=${mnoznikZuzycia}`,
  }
}
