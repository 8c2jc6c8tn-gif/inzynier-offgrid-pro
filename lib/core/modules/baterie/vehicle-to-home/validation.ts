import type { Warning } from "@/lib/core/calc-result"
import type { VehicleToHomeInput } from "./input"
import { rezerwaWiekszaNizPojemnosc, sprawnoscPozaZakresem, wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: VehicleToHomeInput): ValidationResult {
  const errors: Warning[] = []

  if (input.pojemnoscBaterEvKwh < 0) errors.push(wartoscUjemna("pojemnoscBaterEvKwh", input.pojemnoscBaterEvKwh))
  if (input.rezerwaNaDojazdKwh < 0) errors.push(wartoscUjemna("rezerwaNaDojazdKwh", input.rezerwaNaDojazdKwh))
  if (input.kosztWymianyBateriiZl < 0) {
    errors.push(wartoscUjemna("kosztWymianyBateriiZl", input.kosztWymianyBateriiZl))
  }
  if (input.liczbaCykli < 0) errors.push(wartoscUjemna("liczbaCykli", input.liczbaCykli))
  if (input.sprawnoscEfektywnaPct < 0 || input.sprawnoscEfektywnaPct > 100) {
    errors.push(sprawnoscPozaZakresem(input.sprawnoscEfektywnaPct))
  }
  if (input.rezerwaNaDojazdKwh > input.pojemnoscBaterEvKwh && input.pojemnoscBaterEvKwh > 0) {
    errors.push(rezerwaWiekszaNizPojemnosc(input.rezerwaNaDojazdKwh, input.pojemnoscBaterEvKwh))
  }

  return { errors }
}
