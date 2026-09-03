import type { Warning } from "@/lib/core/calc-result"
import type { ObwodPrechargeInput } from "./input"
import { pojemnoscNiedodatnia, rezystancjaNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ObwodPrechargeInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscFalownikaUf < 0) errors.push(pojemnoscNiedodatnia(input.pojemnoscFalownikaUf))
  if (input.rezystancjaPreChargeOhm < 0) errors.push(rezystancjaNiedodatnia(input.rezystancjaPreChargeOhm))
  return { errors }
}
