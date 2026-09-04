import type { Warning } from "@/lib/core/calc-result"
import type { AgregatPradotworczyInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: AgregatPradotworczyInput): ValidationResult {
  const errors: Warning[] = []
  if (input.deficytKwh < 0) {
    errors.push(notPositive("deficytKwh", "deficyt energetyczny", input.deficytKwh))
  }
  if (input.mocAgregatuKw < 0) {
    errors.push(notPositive("mocAgregatuKw", "moc agregatu", input.mocAgregatuKw))
  }
  if (input.sredniZuzycieLH < 0) {
    errors.push(notPositive("sredniZuzycieLH", "średnie zużycie paliwa", input.sredniZuzycieLH))
  }
  if (input.cenaZaLitrZl < 0) {
    errors.push(notPositive("cenaZaLitrZl", "cena paliwa", input.cenaZaLitrZl))
  }
  return { errors }
}
