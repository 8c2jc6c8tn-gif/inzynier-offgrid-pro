import type { Warning } from "@/lib/core/calc-result"
import type { ColdCrankingAmpsInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ColdCrankingAmpsInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieOtwartegoObwoduV < 0) {
    errors.push(wartoscUjemna("napiecieOtwartegoObwoduV", "POLE-NAPIECIE-PAKIETU-BEZ-OBCIAZENIA", input.napiecieOtwartegoObwoduV))
  }
  if (input.pradRozruchowyA < 0) {
    errors.push(wartoscUjemna("pradRozruchowyA", "POLE-PRAD-ROZRUCHOWY", input.pradRozruchowyA))
  }
  if (input.rezystancjaWewnetrznaMOhm < 0) {
    errors.push(wartoscUjemna("rezystancjaWewnetrznaMOhm", "POLE-REZYSTANCJA-WEWNETRZNA", input.rezystancjaWewnetrznaMOhm))
  }
  if (input.minimalneNapiecieFalownikaV < 0) {
    errors.push(wartoscUjemna("minimalneNapiecieFalownikaV", "POLE-MINIMALNE-NAPIECIE-PRACY-FALOWNIKA", input.minimalneNapiecieFalownikaV))
  }
  return { errors }
}
