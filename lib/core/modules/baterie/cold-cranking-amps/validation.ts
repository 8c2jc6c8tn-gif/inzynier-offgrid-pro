import type { Warning } from "@/lib/core/calc-result"
import type { ColdCrankingAmpsInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ColdCrankingAmpsInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieOtwartegoObwoduV < 0) {
    errors.push(wartoscUjemna("napiecieOtwartegoObwoduV", "Napięcie pakietu bez obciążenia", input.napiecieOtwartegoObwoduV))
  }
  if (input.pradRozruchowyA < 0) {
    errors.push(wartoscUjemna("pradRozruchowyA", "Prąd rozruchowy", input.pradRozruchowyA))
  }
  if (input.rezystancjaWewnetrznaMOhm < 0) {
    errors.push(wartoscUjemna("rezystancjaWewnetrznaMOhm", "Rezystancja wewnętrzna", input.rezystancjaWewnetrznaMOhm))
  }
  if (input.minimalneNapiecieFalownikaV < 0) {
    errors.push(wartoscUjemna("minimalneNapiecieFalownikaV", "Minimalne napięcie pracy falownika", input.minimalneNapiecieFalownikaV))
  }
  return { errors }
}
