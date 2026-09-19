import type { Warning } from "@/lib/core/calc-result"
import type { AgregatPradotworczyInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: AgregatPradotworczyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.deficytKwh < 0) {
    errors.push(notPositive("deficytKwh", input.deficytKwh))
  }
  if (input.mocAgregatuKw < 0) {
    errors.push(notPositive("mocAgregatuKw", input.mocAgregatuKw))
  }
  if (input.sredniZuzycieLH < 0) {
    errors.push(notPositive("sredniZuzycieLH", input.sredniZuzycieLH))
  }
  if (input.cenaZaLitrZl < 0) {
    errors.push(notPositive("cenaZaLitrZl", input.cenaZaLitrZl))
  }
  return { errors }
}
