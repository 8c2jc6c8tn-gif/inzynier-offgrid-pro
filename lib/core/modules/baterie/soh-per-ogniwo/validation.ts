import type { Warning } from "@/lib/core/calc-result"
import type { SohPerOgniwoInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SohPerOgniwoInput): ValidationResult {
  const errors: Warning[] = []
  if (input.rezystancjaFabrycznaMOhm < 0) {
    errors.push(notPositive("rezystancjaFabrycznaMOhm", "rezystancja fabryczna", input.rezystancjaFabrycznaMOhm))
  }
  if (input.rezystancjaAktualnaMOhm < 0) {
    errors.push(notPositive("rezystancjaAktualnaMOhm", "rezystancja aktualna", input.rezystancjaAktualnaMOhm))
  }
  return { errors }
}
