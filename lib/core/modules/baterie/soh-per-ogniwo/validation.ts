import type { Warning } from "@/lib/core/calc-result"
import type { SohPerOgniwoInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: SohPerOgniwoInput): ValidationResult {
  const errors: Warning[] = []
  if (input.rezystancjaFabrycznaMOhm < 0) {
    errors.push(notPositive("rezystancjaFabrycznaMOhm", "POLE-REZYSTANCJA-FABRYCZNA-L", input.rezystancjaFabrycznaMOhm))
  }
  if (input.rezystancjaAktualnaMOhm < 0) {
    errors.push(notPositive("rezystancjaAktualnaMOhm", "POLE-REZYSTANCJA-AKTUALNA-L", input.rezystancjaAktualnaMOhm))
  }
  return { errors }
}
