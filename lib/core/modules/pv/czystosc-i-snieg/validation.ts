import type { Warning } from "@/lib/core/calc-result"
import type { HarmonogramCzyszczeniaInput, KatSamooczyszczaniaInput } from "./input"
import { KAT_MAX, KAT_MIN, SPADEK_PCT_MAX, SPADEK_PCT_MIN } from "./constants"
import { outOfRange } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateKatSamooczyszczania(input: KatSamooczyszczaniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.katStopni < KAT_MIN || input.katStopni > KAT_MAX) {
    errors.push(outOfRange("katStopni", input.katStopni, KAT_MIN, KAT_MAX))
  }
  return { errors, warnings: [] }
}

export function validateHarmonogramCzyszczenia(input: HarmonogramCzyszczeniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.spadekProdukcjiPct < SPADEK_PCT_MIN || input.spadekProdukcjiPct > SPADEK_PCT_MAX) {
    errors.push(
      outOfRange(
        "spadekProdukcjiPct",
        input.spadekProdukcjiPct,
        SPADEK_PCT_MIN,
        SPADEK_PCT_MAX,
      ),
    )
  }
  return { errors, warnings: [] }
}
