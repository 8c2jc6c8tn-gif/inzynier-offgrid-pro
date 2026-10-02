import type { Warning } from "@/lib/core/calc-result"
import type { OplacalnoscMagazynuInput } from "./input"
import { notPositive, sprawnoscPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: OplacalnoscMagazynuInput): ValidationResult {
  const errors: Warning[] = []
  if (input.cenaBateriiZl < 0) {
    errors.push(notPositive("cenaBateriiZl", "POLE-CENA-BATERII-L", input.cenaBateriiZl))
  }
  if (input.pojemnoscUzytecznaKwh < 0) {
    errors.push(notPositive("pojemnoscUzytecznaKwh", "POLE-POJEMNOSC-UZYTECZNA-L", input.pojemnoscUzytecznaKwh))
  }
  if (input.liczbaCykli < 0) {
    errors.push(notPositive("liczbaCykli", "POLE-LICZBA-CYKLI-L", input.liczbaCykli))
  }
  if (input.sprawnoscPct < 0 || input.sprawnoscPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscPct))
  }
  return { errors }
}
