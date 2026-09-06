import type { Warning } from "@/lib/core/calc-result"
import type { DoborPrzekrojuKablaInput } from "./input"
import { wartoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DoborPrzekrojuKablaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pradA < 0) errors.push(wartoscNiedodatnia("pradA", input.pradA))
  if (input.napiecieV < 0) errors.push(wartoscNiedodatnia("napiecieV", input.napiecieV))
  if (input.dlugoscTrasyM < 0) errors.push(wartoscNiedodatnia("dlugoscTrasyM", input.dlugoscTrasyM))
  if (input.dopuszczalnySpadekNapieciaPct < 0) {
    errors.push(wartoscNiedodatnia("dopuszczalnySpadekNapieciaPct", input.dopuszczalnySpadekNapieciaPct))
  }
  if (input.liczbaKabliWWiazce < 0) errors.push(wartoscNiedodatnia("liczbaKabliWWiazce", input.liczbaKabliWWiazce))
  if (input.sprawdzanyPrzekrojMm2 !== null && input.sprawdzanyPrzekrojMm2 <= 0) {
    errors.push(wartoscNiedodatnia("sprawdzanyPrzekrojMm2", input.sprawdzanyPrzekrojMm2))
  }

  return { errors }
}
