import type { CalcResult } from "@/lib/core/calc-result"
import type { StratyOkablowanieDcInput } from "./input"
import { validateInput } from "./validation"
import { strataPonizejCelu, strataPowyzejCelu } from "./warnings"
import { CEL_STRATY_MAX_PCT, PRZEKROJE_DO_POROWNANIA_MM2, REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PorownaniePrzekroju = {
  przekrojMm2: number
  strataProcentowa: number
}

export type StratyOkablowanieDcResult = {
  rezystancjaOhm: number
  spadekNapieciaV: number
  strataMocyW: number
  strataProcentowa: number
  porownaniePrzekrojow: PorownaniePrzekroju[]
}

const FORMULA =
  "R = \\rho \\times 2L / S \\;\\; ; \\;\\; \\Delta U = I \\times R \\;\\; ; \\;\\; P_{strata} = I^2 \\times R"

/** Obwód DC panel↔falownik ma dwa przewody (plus i minus) — prąd pokonuje długość kabla w obie
 * strony, stąd 2×L w rezystancji całkowitej pętli (standardowa praktyka inżynierska, nie
 * wymyślony współczynnik). */
export function obliczStrateProcentowa(
  dlugoscKablaM: number,
  pradA: number,
  napiecieV: number,
  przekrojMm2: number,
): number {
  const rezystancjaOhm = (REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M * (2 * dlugoscKablaM)) / przekrojMm2
  const strataMocyW = pradA * pradA * rezystancjaOhm
  return (strataMocyW / (napiecieV * pradA)) * 100
}

/**
 * Ekran 8, Moduł 3 "Instalacja PV" — "Straty na okablowaniu DC (efekt Joule'a)" (dawne 2.14,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór `R = ρ×L/S` 1:1 ze źródła (ρ_Cu =
 * 0,0175 Ω·mm²/m — uniwersalna stała fizyczna, dana wprost w źródle). Przykład źródła (30m,
 * 15A: 4mm²→6%, 6mm²→4%, 10mm²→2,4%) odtworzony dokładnie (przy Vmp≈65,6V, wyprowadzonym z
 * przykładu — zweryfikowane niezależnie w Pythonie przed implementacją).
 */
export function calculateStratyOkablowanieDc(
  input: StratyOkablowanieDcInput,
): CalcResult<StratyOkablowanieDcResult> {
  const { errors } = validateInput(input)
  const pustyWynik: StratyOkablowanieDcResult = {
    rezystancjaOhm: 0,
    spadekNapieciaV: 0,
    strataMocyW: 0,
    strataProcentowa: 0,
    porownaniePrzekrojow: [],
  }
  const inputs = {
    dlugoscKablaM: input.dlugoscKablaM,
    pradA: input.pradA,
    napiecieV: input.napiecieV,
    przekrojMm2: input.przekrojMm2,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.dlugoscKablaM === 0 || input.pradA === 0 || input.napiecieV === 0 || input.przekrojMm2 === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const rezystancjaOhm = (REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M * (2 * input.dlugoscKablaM)) / input.przekrojMm2
  const spadekNapieciaV = input.pradA * rezystancjaOhm
  const strataMocyW = input.pradA * input.pradA * rezystancjaOhm
  const strataProcentowa = (strataMocyW / (input.napiecieV * input.pradA)) * 100

  const porownaniePrzekrojow: PorownaniePrzekroju[] = PRZEKROJE_DO_POROWNANIA_MM2.map((przekrojMm2) => ({
    przekrojMm2,
    strataProcentowa: obliczStrateProcentowa(input.dlugoscKablaM, input.pradA, input.napiecieV, przekrojMm2),
  }))

  const warnings =
    strataProcentowa <= CEL_STRATY_MAX_PCT
      ? [strataPonizejCelu(strataProcentowa, CEL_STRATY_MAX_PCT)]
      : [strataPowyzejCelu(strataProcentowa, CEL_STRATY_MAX_PCT)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { rezystancjaOhm, spadekNapieciaV, strataMocyW, strataProcentowa, porownaniePrzekrojow },
    unit: "%",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Rezystancja pętli liczona dla dwóch przewodów (plus i minus) — 2×długość kabla, standardowa praktyka DC.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
