import type { Warning } from "@/lib/core/calc-result"
import type { ZacienienieDiodyBocznikujaceInput } from "./input"
import { wartoscUjemna, liczbaSekcjiPozaZakresem } from "./warnings"
import { MAKS_LICZBA_ZACIENIONYCH_SEKCJI } from "./constants"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ZacienienieDiodyBocznikujaceInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocPaneluNominalnaW < 0) errors.push(wartoscUjemna("mocPaneluNominalnaW", input.mocPaneluNominalnaW))
  if (input.liczbaPaneliWStringu < 0)
    errors.push(wartoscUjemna("liczbaPaneliWStringu", input.liczbaPaneliWStringu))
  if (
    input.liczbaZacienionychSekcji < 0 ||
    input.liczbaZacienionychSekcji > MAKS_LICZBA_ZACIENIONYCH_SEKCJI ||
    !Number.isInteger(input.liczbaZacienionychSekcji)
  ) {
    errors.push(liczbaSekcjiPozaZakresem(input.liczbaZacienionychSekcji))
  }
  return { errors }
}
