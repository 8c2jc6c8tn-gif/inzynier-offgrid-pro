import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { HarmonogramCzyszczeniaInput, KatSamooczyszczaniaInput } from "./input"
import {
  KAT_PRZEJSCIOWY_MAX,
  KAT_SPLUKIWANIE_MAX,
  KAT_ZALEGANIE_MAX,
  SPADEK_PROG_MYCIA_PCT,
} from "./constants"
import { validateHarmonogramCzyszczenia, validateKatSamooczyszczania } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type KatBand = "zaleganie" | "przejsciowy" | "splukiwanie" | "zsuwanie"

type Params = Record<string, string | number>

/** Opis pasma jako klucz słownika + parametry (17.2) — tekst rozwiązuje warstwa prezentacji. */
export type KatSamooczyszczaniaResult = {
  band: KatBand
  opisKey: string
  opisParams: Params
}

const KAT_OPISY: Record<KatBand, { key: string; params: Params }> = {
  zaleganie: { key: "CZYSNIEG-KAT-ZALEGANIE", params: { max: KAT_ZALEGANIE_MAX } },
  przejsciowy: {
    key: "CZYSNIEG-KAT-PRZEJSCIOWY",
    params: { min: KAT_ZALEGANIE_MAX, max: KAT_PRZEJSCIOWY_MAX },
  },
  splukiwanie: {
    key: "CZYSNIEG-KAT-SPLUKIWANIE",
    params: { min: KAT_PRZEJSCIOWY_MAX, max: KAT_SPLUKIWANIE_MAX },
  },
  zsuwanie: { key: "CZYSNIEG-KAT-ZSUWANIE", params: { min: KAT_SPLUKIWANIE_MAX } },
}

/**
 * Ekran 24, Moduł 3, sekcja "Kąt a samooczyszczanie" (dawne 2.44,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md).
 */
export function classifyKatSamooczyszczania(
  input: KatSamooczyszczaniaInput,
): CalcResult<KatSamooczyszczaniaResult> {
  const { errors } = validateKatSamooczyszczania(input)
  const inputs = { katStopni: input.katStopni }
  const formula = "pasmo = f(kąt), progi: 10°, 15°, 30°"

  if (errors.length > 0) {
    return {
      value: { band: "zaleganie", opisKey: "", opisParams: {} },
      unit: "",
      status: "INVALID_INPUT",
      formula,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  let band: KatBand
  if (input.katStopni < KAT_ZALEGANIE_MAX) band = "zaleganie"
  else if (input.katStopni < KAT_PRZEJSCIOWY_MAX) band = "przejsciowy"
  else if (input.katStopni <= KAT_SPLUKIWANIE_MAX) band = "splukiwanie"
  else band = "zsuwanie"

  const warnings: Warning[] =
    band === "przejsciowy"
      ? [
          {
            code: "KAT-ZAKRES-PRZEJSCIOWY",
            level: "info",
            i18nKey: "KAT-ZAKRES-PRZEJSCIOWY",
            technicalMessage: `katStopni = ${input.katStopni}, poza opisanymi pasmami <10 / 15-30 / >30`,
            field: "katStopni",
          },
        ]
      : []

  return {
    value: { band, opisKey: KAT_OPISY[band].key, opisParams: KAT_OPISY[band].params },
    unit: "",
    status: warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    formula,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}

export type HarmonogramCzyszczeniaResult = {
  rekomendacjaMycia: boolean
  powodKey: string
  powodParams: Params
}

/**
 * Ekran 24, Moduł 3, sekcja "Harmonogram czyszczenia — live" (dawne 2.40,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md). Próg rekomendacji mycia: strata >5-10%
 * (tu: środek przedziału), z odroczeniem, jeśli deszcz naturalnie umyje panele.
 */
export function ocenHarmonogramCzyszczenia(
  input: HarmonogramCzyszczeniaInput,
): CalcResult<HarmonogramCzyszczeniaResult> {
  const { errors } = validateHarmonogramCzyszczenia(input)
  const inputs = {
    spadekProdukcjiPct: input.spadekProdukcjiPct,
    deszczWCiaguKilkuDni: input.deszczWCiaguKilkuDni ? 1 : 0,
  }
  const formula = `rekomendacja = spadek > ${SPADEK_PROG_MYCIA_PCT}\\% \\land \\lnot deszcz\\_wkrótce`

  if (errors.length > 0) {
    return {
      value: { rekomendacjaMycia: false, powodKey: "", powodParams: {} },
      unit: "",
      status: "INVALID_INPUT",
      formula,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const przekroczonyProg = input.spadekProdukcjiPct > SPADEK_PROG_MYCIA_PCT
  let rekomendacjaMycia: boolean
  let powodKey: string

  if (!przekroczonyProg) {
    rekomendacjaMycia = false
    powodKey = "CZYSNIEG-POWOD-PONIZEJ-PROGU"
  } else if (input.deszczWCiaguKilkuDni) {
    rekomendacjaMycia = false
    powodKey = "CZYSNIEG-POWOD-DESZCZ-ODROCZONE"
  } else {
    rekomendacjaMycia = true
    powodKey = "CZYSNIEG-POWOD-MYCIE"
  }
  const powodParams: Params = { spadek: input.spadekProdukcjiPct, prog: SPADEK_PROG_MYCIA_PCT }

  return {
    value: { rekomendacjaMycia, powodKey, powodParams },
    unit: "",
    status: "VALID",
    formula,
    inputs,
    assumptions: [{ kod: "CZYSNIEG-ZALOZENIE-PROG-MYCIA", params: { prog: SPADEK_PROG_MYCIA_PCT } }],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
