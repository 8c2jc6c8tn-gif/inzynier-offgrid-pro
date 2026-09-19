import type { Warning } from "@/lib/core/calc-result"
import type { UrzadzeniaZmienneInput } from "./input"
import { KATALOG_URZADZEN_ZMIENNYCH } from "./constants"
import { pozycjaNiedodatnia } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: UrzadzeniaZmienneInput): ValidationResult {
  const errors: Warning[] = []

  for (const pozycja of input.urzadzenia) {
    if (!pozycja.wybrane) continue
    const def = KATALOG_URZADZEN_ZMIENNYCH.find((d) => d.id === pozycja.id)
    const label = def?.label ?? pozycja.id
    if (pozycja.mocW <= 0 || pozycja.czasMin <= 0) {
      errors.push(pozycjaNiedodatnia(label, pozycja.mocW <= 0 ? pozycja.mocW : pozycja.czasMin))
    }
  }

  if (input.plytaIndukcyjnaWybrana && (input.plytaIndukcyjnaMocW <= 0 || input.plytaIndukcyjnaCzasMin <= 0)) {
    errors.push(
      pozycjaNiedodatnia(
        "Płyta indukcyjna",
        input.plytaIndukcyjnaMocW <= 0 ? input.plytaIndukcyjnaMocW : input.plytaIndukcyjnaCzasMin,
      ),
    )
  }

  return { errors }
}
