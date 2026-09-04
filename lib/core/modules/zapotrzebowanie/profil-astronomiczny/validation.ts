import type { Warning } from "@/lib/core/calc-result"
import type { ProfilAstronomicznyInput } from "./input"
import {
  MAX_SZEROKOSC_GEOGRAFICZNA,
  MIN_SZEROKOSC_GEOGRAFICZNA,
} from "./constants"
import { dzienPozaZakresem, mocOdbiornikaUjemna, szerokoscPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ProfilAstronomicznyInput): ValidationResult {
  const errors: Warning[] = []

  if (
    input.szerokoscGeograficzna !== null &&
    (input.szerokoscGeograficzna < MIN_SZEROKOSC_GEOGRAFICZNA ||
      input.szerokoscGeograficzna > MAX_SZEROKOSC_GEOGRAFICZNA)
  ) {
    errors.push(szerokoscPozaZakresem(input.szerokoscGeograficzna))
  }

  if (input.dzienRoku !== 0 && (input.dzienRoku < 1 || input.dzienRoku > 365)) {
    errors.push(dzienPozaZakresem(input.dzienRoku))
  }

  if (input.mocOdbiornikaNocnegoW < 0) errors.push(mocOdbiornikaUjemna(input.mocOdbiornikaNocnegoW))

  return { errors }
}
