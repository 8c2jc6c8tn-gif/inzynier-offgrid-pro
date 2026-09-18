import type { Warning } from "@/lib/core/calc-result"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "./constants"

export function dociskZaMaly(dociskKgf: number): Warning {
  return {
    code: "DOCISK-ZA-MALY",
    level: "critical",
    i18nKey: "DOCISK-ZA-MALY",
    params: { docisk: dociskKgf, min: DOCISK_MIN_KGF, max: DOCISK_MAX_KGF },
    technicalMessage: `dociskKgf = ${dociskKgf} < DOCISK_MIN_KGF = ${DOCISK_MIN_KGF}`,
    field: "dociskKgf",
  }
}

export function dociskZaDuzy(dociskKgf: number): Warning {
  return {
    code: "DOCISK-ZA-DUZY",
    level: "critical",
    i18nKey: "DOCISK-ZA-DUZY",
    params: { docisk: dociskKgf, min: DOCISK_MIN_KGF, max: DOCISK_MAX_KGF },
    technicalMessage: `dociskKgf = ${dociskKgf} > DOCISK_MAX_KGF = ${DOCISK_MAX_KGF}`,
    field: "dociskKgf",
  }
}

export function brakLuzuNaPeczenie(): Warning {
  return {
    code: "BRAK-LUZU-NA-PECZNIENIE",
    level: "warning",
    i18nKey: "BRAK-LUZU-NA-PECZNIENIE",
    technicalMessage: "luzNaPeczenie === false",
  }
}

export function dociskOk(dociskKgf: number): Warning {
  return {
    code: "DOCISK-OK",
    level: "info",
    i18nKey: "DOCISK-OK",
    params: { docisk: dociskKgf, min: DOCISK_MIN_KGF, max: DOCISK_MAX_KGF },
    technicalMessage: `dociskKgf w [${DOCISK_MIN_KGF}, ${DOCISK_MAX_KGF}], luzNaPeczenie === true`,
  }
}
