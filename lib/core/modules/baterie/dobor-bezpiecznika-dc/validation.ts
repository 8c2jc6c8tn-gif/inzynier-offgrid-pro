import type { Warning } from "@/lib/core/calc-result"
import type { DoborBezpiecznikaInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: DoborBezpiecznikaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.napiecieBateriiV <= 0) {
    errors.push(notPositive("napiecieBateriiV", "POLE-NAPIECIE-BATERII-L", input.napiecieBateriiV))
  }
  if (input.rezystancjaWewnetrznaOhm <= 0) {
    errors.push(
      notPositive("rezystancjaWewnetrznaOhm", "POLE-REZYSTANCJA-WEWNETRZNA-L", input.rezystancjaWewnetrznaOhm),
    )
  }
  if (input.aicBezpiecznikaA <= 0) {
    errors.push(notPositive("aicBezpiecznikaA", "POLE-AIC-BEZPIECZNIKA", input.aicBezpiecznikaA))
  }

  return { errors, warnings: [] }
}
