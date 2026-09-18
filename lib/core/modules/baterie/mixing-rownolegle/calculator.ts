import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { MixingRownoleglInput } from "./input"
import { validateInput } from "./validation"
import { innaChemiaBezIzolacji, roznicaNapiecZaDuza } from "./warnings"
import { PROG_ROZNICY_NAPIEC_V } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type MixingRownoleglResult = {
  roznicaNapiecV: number
  iWyrownawczyA: number
  udzialPradu1Pct: number
  udzialPradu2Pct: number
  chemiaZgodna: boolean
  napieciaOk: boolean
}

const FORMULA = "I_{wyr} = \\Delta V / (R_1 + R_2)"

/**
 * Ekran 18, Moduł 4 "Magazyn energii / baterie" — "Łączenie równoległe różnych baterii
 * (Mixing)" (dawne 3.20, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Prąd
 * wyrównawczy 1:1 ze źródła. Udział każdej baterii w prądzie obciążenia (dzielnik prądowy,
 * `udzial_i = R_{druga} / (R1+R2)`) to bezpośrednia konsekwencja tego samego prawa Ohma dla
 * gałęzi równoległych — nie osobna, wymyślona zależność — liczony z tych samych dwóch
 * rezystancji, bez dodatkowych, niepodanych w źródle współczynników.
 */
export function calculateMixingRownolegle(input: MixingRownoleglInput): CalcResult<MixingRownoleglResult> {
  const { errors } = validateInput(input)
  const pustyWynik: MixingRownoleglResult = {
    roznicaNapiecV: 0,
    iWyrownawczyA: 0,
    udzialPradu1Pct: 0,
    udzialPradu2Pct: 0,
    chemiaZgodna: false,
    napieciaOk: false,
  }
  const inputs = {
    napiecieNominalneV1: input.napiecieNominalneV1,
    napiecieNominalneV2: input.napiecieNominalneV2,
    rezystancjaWewnetrznaMOhm1: input.rezystancjaWewnetrznaMOhm1,
    rezystancjaWewnetrznaMOhm2: input.rezystancjaWewnetrznaMOhm2,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.chemia1 === "" ||
    input.chemia2 === "" ||
    input.napiecieNominalneV1 === 0 ||
    input.napiecieNominalneV2 === 0 ||
    input.rezystancjaWewnetrznaMOhm1 === 0 ||
    input.rezystancjaWewnetrznaMOhm2 === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const roznicaNapiecV = Math.abs(input.napiecieNominalneV1 - input.napiecieNominalneV2)
  const r1Ohm = input.rezystancjaWewnetrznaMOhm1 / 1000
  const r2Ohm = input.rezystancjaWewnetrznaMOhm2 / 1000
  const iWyrownawczyA = roznicaNapiecV / (r1Ohm + r2Ohm)
  const udzialPradu1Pct = (r2Ohm / (r1Ohm + r2Ohm)) * 100
  const udzialPradu2Pct = (r1Ohm / (r1Ohm + r2Ohm)) * 100

  const chemiaZgodna = input.chemia1 === input.chemia2
  const napieciaOk = roznicaNapiecV <= PROG_ROZNICY_NAPIEC_V

  const warnings: Warning[] = []
  if (!chemiaZgodna) warnings.push(innaChemiaBezIzolacji(input.chemia1, input.chemia2))
  if (!napieciaOk) warnings.push(roznicaNapiecZaDuza(roznicaNapiecV))

  return {
    value: {
      roznicaNapiecV,
      iWyrownawczyA,
      udzialPradu1Pct,
      udzialPradu2Pct,
      chemiaZgodna,
      napieciaOk,
    },
    unit: "V",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "PRAD-WYROWNAWCZY-CHWILA-POLACZENIA" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
