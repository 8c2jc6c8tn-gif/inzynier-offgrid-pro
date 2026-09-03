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

export type KatSamooczyszczaniaResult = {
  band: KatBand
  opis: string
}

const KAT_OPISY: Record<KatBand, string> = {
  zaleganie: "Kąt <10° — woda i brud będą zalegać na panelu.",
  przejsciowy:
    "Zakres 10–15° — źródło nie podaje dla niego jednoznacznej klasyfikacji (luka danych, nie zgadujemy).",
  splukiwanie: "Kąt 15–30° — deszcz naturalnie spłukuje kurz.",
  zsuwanie: "Kąt >30° — śnieg i liście zsuwają się łatwiej same.",
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
      value: { band: "zaleganie", opis: "" },
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
            message: "Dla tego zakresu kąta źródło nie podaje jednoznacznej klasyfikacji.",
            technicalMessage: `katStopni = ${input.katStopni}, poza opisanymi pasmami <10 / 15-30 / >30`,
            field: "katStopni",
          },
        ]
      : []

  return {
    value: { band, opis: KAT_OPISY[band] },
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
  powod: string
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
      value: { rekomendacjaMycia: false, powod: "" },
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
  let powod: string

  if (!przekroczonyProg) {
    rekomendacjaMycia = false
    powod = `Spadek produkcji (${input.spadekProdukcjiPct}%) poniżej progu ${SPADEK_PROG_MYCIA_PCT}% — mycie niepotrzebne.`
  } else if (input.deszczWCiaguKilkuDni) {
    rekomendacjaMycia = false
    powod = "Próg przekroczony, ale nadchodzący deszcz naturalnie umyje panele — rekomendacja odroczona."
  } else {
    rekomendacjaMycia = true
    powod = `Spadek produkcji (${input.spadekProdukcjiPct}%) przekracza próg ${SPADEK_PROG_MYCIA_PCT}%, brak deszczu w najbliższych dniach.`
  }

  return {
    value: { rekomendacjaMycia, powod },
    unit: "",
    status: "VALID",
    formula,
    inputs,
    assumptions: [
      `Próg mycia przyjęty jako środek przedziału źródłowego "strata >5-10%" = ${SPADEK_PROG_MYCIA_PCT}%.`,
    ],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
