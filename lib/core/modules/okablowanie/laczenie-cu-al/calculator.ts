import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { LaczenieCuAlInput } from "./input"
import { validateInput } from "./validation"
import {
  kontrolujOkresowo,
  korozjaGalwanicznaCuAl,
  paraOk,
  paraPozaZakresem,
  wymagaPodkladkiISmaru,
} from "./warnings"
import { ETYKIETY_MATERIALOW, kluczPary, WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type LaczenieCuAlResult = {
  /** null = para poza zakresem tabeli źródła. */
  bezpieczna: boolean | null
  /** Wymagany przekrój Al dla tego samego prądu co podany przekrój Cu [mm²]. 0 = nie liczone. */
  wymaganyPrzekrojAlMm2: number
}

const FORMULA = "S_{Al} = S_{Cu} \\times 1{,}6"

function pusty(): LaczenieCuAlResult {
  return { bezpieczna: null, wymaganyPrzekrojAlMm2: 0 }
}

/**
 * Ekran 4, Moduł 5 "Okablowanie i zabezpieczenia" — "Łączenie Cu-Al i ochrona przed korozją"
 * (dawne 4.36, 4.37, 4.39, Sekcja B). Tabela par metali 1:1 ze źródła — obejmuje dokładnie te
 * kombinacje, które źródło ocenia (Cu+Al, stal ocynkowana+Cu, stal nierdzewna+Al w suchym/słonym
 * środowisku). Każda inna kombinacja (np. stal nierdzewna+Al w środowisku wilgotnym, albo
 * mosiądz+cokolwiek) jest `OUT_OF_SCOPE` — źródło jej nie ocenia, nie zgadujemy werdyktu.
 */
export function calculateLaczenieCuAl(input: LaczenieCuAlInput): CalcResult<LaczenieCuAlResult> {
  const { errors } = validateInput(input)
  const inputs = { przekrojCuMm2: input.przekrojCuMm2 }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const wymaganyPrzekrojAlMm2 =
    input.przekrojCuMm2 > 0 ? input.przekrojCuMm2 * WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU : 0

  if (input.material1 === null || input.material2 === null) {
    return {
      value: { bezpieczna: null, wymaganyPrzekrojAlMm2 },
      unit: "",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const etykieta = `${ETYKIETY_MATERIALOW[input.material1]} + ${ETYKIETY_MATERIALOW[input.material2]}`
  const klucz = kluczPary(input.material1, input.material2)

  let warnings: Warning[]
  let bezpieczna: boolean | null

  if (klucz === kluczPary("Cu", "Al")) {
    bezpieczna = input.maZlaczkeBimetaliczna
    warnings = [bezpieczna ? paraOk(etykieta) : korozjaGalwanicznaCuAl()]
  } else if (klucz === kluczPary("stal-ocynkowana", "Cu")) {
    bezpieczna = input.maPodkladkeISmar
    warnings = [bezpieczna ? paraOk(etykieta) : wymagaPodkladkiISmaru()]
  } else if (klucz === kluczPary("stal-nierdzewna", "Al") && input.srodowisko === "suche") {
    bezpieczna = true
    warnings = [paraOk(etykieta)]
  } else if (klucz === kluczPary("stal-nierdzewna", "Al") && input.srodowisko === "slone") {
    bezpieczna = true
    warnings = [kontrolujOkresowo()]
  } else {
    return {
      value: { bezpieczna: null, wymaganyPrzekrojAlMm2 },
      unit: "",
      status: "OUT_OF_SCOPE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [paraPozaZakresem(etykieta)],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { bezpieczna, wymaganyPrzekrojAlMm2 },
    unit: "",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
