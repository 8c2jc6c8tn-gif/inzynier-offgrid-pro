import type { Warning } from "@/lib/core/calc-result"
import type { MixingRownoleglInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: MixingRownoleglInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieNominalneV1 < 0) {
    errors.push(wartoscUjemna("napiecieNominalneV1", "POLE-NAPIECIE-NOMINALNE-BATERIA-1", input.napiecieNominalneV1))
  }
  if (input.napiecieNominalneV2 < 0) {
    errors.push(wartoscUjemna("napiecieNominalneV2", "POLE-NAPIECIE-NOMINALNE-BATERIA-2", input.napiecieNominalneV2))
  }
  if (input.rezystancjaWewnetrznaMOhm1 < 0) {
    errors.push(
      wartoscUjemna("rezystancjaWewnetrznaMOhm1", "POLE-REZYSTANCJA-WEWNETRZNA-BATERIA-1", input.rezystancjaWewnetrznaMOhm1),
    )
  }
  if (input.rezystancjaWewnetrznaMOhm2 < 0) {
    errors.push(
      wartoscUjemna("rezystancjaWewnetrznaMOhm2", "POLE-REZYSTANCJA-WEWNETRZNA-BATERIA-2", input.rezystancjaWewnetrznaMOhm2),
    )
  }
  return { errors }
}
