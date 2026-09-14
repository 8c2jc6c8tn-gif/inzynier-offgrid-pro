import type { Warning } from "@/lib/core/calc-result"
import type { NapiecieSystemoweInput } from "./input"
import { mocUjemna, wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: NapiecieSystemoweInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocSzczytowaW < 0) errors.push(mocUjemna(input.mocSzczytowaW))
  if (input.ogrzewanieMocW < 0) errors.push(wartoscUjemna("ogrzewanieMocW", input.ogrzewanieMocW))
  if (input.mocCiaglaFalownikaPlanowanaW < 0) errors.push(wartoscUjemna("mocCiaglaFalownikaPlanowanaW", input.mocCiaglaFalownikaPlanowanaW))
  if (input.docelowaPojemnoscKwh < 0) errors.push(wartoscUjemna("docelowaPojemnoscKwh", input.docelowaPojemnoscKwh))
  if (input.liczbaPaneliWStringu < 0) errors.push(wartoscUjemna("liczbaPaneliWStringu", input.liczbaPaneliWStringu))
  return { errors }
}
