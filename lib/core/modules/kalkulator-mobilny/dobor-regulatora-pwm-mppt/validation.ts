import type { Warning } from "@/lib/core/calc-result"
import type { ReguRatorPwmMpptInput } from "./input"
import { wartoscNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ReguRatorPwmMpptInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocPaneliW < 0) {
    errors.push(wartoscNiedodatnia("mocPaneliW", "POLE-MOC-PANELI", input.mocPaneliW))
  }
  if (input.napiecieNominalnePaneluV < 0) {
    errors.push(wartoscNiedodatnia("napiecieNominalnePaneluV", "POLE-NAPIECIE-PANELI", input.napiecieNominalnePaneluV))
  }
  if (input.napiecieAkumulatoraV < 0) {
    errors.push(wartoscNiedodatnia("napiecieAkumulatoraV", "POLE-NAPIECIE-AKUMULATORA", input.napiecieAkumulatoraV))
  }
  return { errors }
}
