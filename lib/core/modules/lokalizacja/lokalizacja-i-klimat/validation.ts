import type { Warning } from "@/lib/core/calc-result"
import type { LokalizacjaInput } from "./input"
import {
  DLUGOSC_MAX,
  DLUGOSC_MIN,
  SZEROKOSC_MAX,
  SZEROKOSC_MIN,
  TEMPERATURA_MAX_C,
  TEMPERATURA_MIN_C,
} from "./constants"
import { outOfRange } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: LokalizacjaInput): ValidationResult {
  const errors: Warning[] = []

  if (input.szerokoscGeograficzna !== undefined) {
    if (input.szerokoscGeograficzna < SZEROKOSC_MIN || input.szerokoscGeograficzna > SZEROKOSC_MAX) {
      errors.push(
        outOfRange("szerokoscGeograficzna", "POLE-SZEROKOSC-GEOGRAFICZNA", input.szerokoscGeograficzna, SZEROKOSC_MIN, SZEROKOSC_MAX),
      )
    }
  }

  if (input.dlugoscGeograficzna !== undefined) {
    if (input.dlugoscGeograficzna < DLUGOSC_MIN || input.dlugoscGeograficzna > DLUGOSC_MAX) {
      errors.push(
        outOfRange("dlugoscGeograficzna", "POLE-DLUGOSC-GEOGRAFICZNA", input.dlugoscGeograficzna, DLUGOSC_MIN, DLUGOSC_MAX),
      )
    }
  }

  if (input.temperaturaMinimalnaC !== undefined) {
    if (input.temperaturaMinimalnaC < TEMPERATURA_MIN_C || input.temperaturaMinimalnaC > TEMPERATURA_MAX_C) {
      errors.push(
        outOfRange("temperaturaMinimalnaC", "POLE-TEMPERATURA-MINIMALNA", input.temperaturaMinimalnaC, TEMPERATURA_MIN_C, TEMPERATURA_MAX_C),
      )
    }
  }

  return { errors, warnings: [] }
}
