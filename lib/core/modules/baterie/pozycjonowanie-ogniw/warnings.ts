import type { Warning } from "@/lib/core/calc-result"
import { DOCISK_MAX_KGF, DOCISK_MIN_KGF } from "./constants"

export function dociskZaMaly(dociskKgf: number): Warning {
  return {
    code: "DOCISK-ZA-MALY",
    level: "critical",
    message: `Docisk (${dociskKgf} kgf) jest poniżej zalecanego zakresu ${DOCISK_MIN_KGF}-${DOCISK_MAX_KGF} kgf — ryzyko utraty kontaktu wewnętrznego i przyspieszonej degradacji.`,
    technicalMessage: `dociskKgf = ${dociskKgf} < DOCISK_MIN_KGF = ${DOCISK_MIN_KGF}`,
    field: "dociskKgf",
  }
}

export function dociskZaDuzy(dociskKgf: number): Warning {
  return {
    code: "DOCISK-ZA-DUZY",
    level: "critical",
    message: `Docisk (${dociskKgf} kgf) jest powyżej zalecanego zakresu ${DOCISK_MIN_KGF}-${DOCISK_MAX_KGF} kgf — ryzyko uszkodzenia mechanicznego ogniw.`,
    technicalMessage: `dociskKgf = ${dociskKgf} > DOCISK_MAX_KGF = ${DOCISK_MAX_KGF}`,
    field: "dociskKgf",
  }
}

export function brakLuzuNaPeczenie(): Warning {
  return {
    code: "BRAK-LUZU-NA-PECZNIENIE",
    level: "warning",
    message: "Ogniwa rosną o 1-2% podczas ładowania — bez marginesu luzu docisk stały wzrośnie ponad zalecany zakres.",
    technicalMessage: "luzNaPeczenie === false",
  }
}

export function dociskOk(dociskKgf: number): Warning {
  return {
    code: "DOCISK-OK",
    level: "info",
    message: `Docisk (${dociskKgf} kgf) mieści się w zalecanym zakresie ${DOCISK_MIN_KGF}-${DOCISK_MAX_KGF} kgf, z zostawionym luzem na dylatację.`,
    technicalMessage: `dociskKgf w [${DOCISK_MIN_KGF}, ${DOCISK_MAX_KGF}], luzNaPeczenie === true`,
  }
}
