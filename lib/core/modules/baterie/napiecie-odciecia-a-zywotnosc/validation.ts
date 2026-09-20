import type { Warning } from "@/lib/core/calc-result"
import type { NapiecieOdcieciaInput } from "./input"
import { liczbaOgniwNiepoprawna, napiecieOdcieciaNiedodatnie } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: NapiecieOdcieciaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.napiecieOdcieciaV < 0) errors.push(napiecieOdcieciaNiedodatnie(input.napiecieOdcieciaV))
  if (
    input.liczbaOgniwSzeregowo !== 0 &&
    (input.liczbaOgniwSzeregowo < 1 || !Number.isInteger(input.liczbaOgniwSzeregowo))
  ) {
    errors.push(liczbaOgniwNiepoprawna(input.liczbaOgniwSzeregowo))
  }

  return { errors }
}
