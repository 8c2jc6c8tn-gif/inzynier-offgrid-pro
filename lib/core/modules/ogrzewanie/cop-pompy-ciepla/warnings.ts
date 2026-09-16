import type { Warning } from "@/lib/core/calc-result"
import { COP_MAX, COP_MIN, MOC_CIEPLNA_KW_MAX } from "./constants"

/** Zmigrowane do i18n (docs/standards/17-i18n.md) — bez `message`, patrz `lib/i18n/dictionary-*.ts`. */

export function notPositive(field: string, label: string, value: number): Warning {
  return {
    code: `${field.toUpperCase()}-NIEDODATNI`,
    level: "critical",
    i18nKey: "WARTOSC-NIEDODATNIA",
    params: { label },
    technicalMessage: `${field} = ${value}, oczekiwano > 0`,
    field,
  }
}

export function copOutOfRange(value: number): Warning {
  return {
    code: "COP-POZA-ZAKRESEM",
    level: "critical",
    i18nKey: "COP-POZA-ZAKRESEM",
    params: { min: COP_MIN, max: COP_MAX },
    technicalMessage: `cop = ${value}, oczekiwano [${COP_MIN}, ${COP_MAX}]`,
    field: "cop",
  }
}

export function mocCieplnaUnusuallyHigh(value: number): Warning {
  return {
    code: "MOC-CIEPLNA-NIETYPOWO-WYSOKA",
    level: "info",
    i18nKey: "MOC-CIEPLNA-NIETYPOWO-WYSOKA",
    technicalMessage: `mocCieplnaKw = ${value} > próg ${MOC_CIEPLNA_KW_MAX}`,
    field: "mocCieplnaKw",
  }
}
