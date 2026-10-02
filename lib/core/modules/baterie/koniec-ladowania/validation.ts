import type { Warning } from "@/lib/core/calc-result"
import type { KoniecLadowaniaInput } from "./input"
import { notPositive, ujemnaWartosc } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: KoniecLadowaniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscAh < 0) {
    errors.push(notPositive("pojemnoscAh", "POLE-POJEMNOSC-BATERII-L", input.pojemnoscAh))
  }
  if (input.napiecieAbsorpcjiV < 0) {
    errors.push(notPositive("napiecieAbsorpcjiV", "POLE-NAPIECIE-ABSORPCJI-L", input.napiecieAbsorpcjiV))
  }
  if (input.progKoncowyC < 0 || input.progKoncowyC > 1) {
    errors.push({
      code: "PROG-KONCOWY-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "PROG-KONCOWY-POZA-ZAKRESEM",
      technicalMessage: `progKoncowyC = ${input.progKoncowyC}, oczekiwano [0, 1]`,
      field: "progKoncowyC",
    })
  }
  if (input.aktualnyPradA !== null && input.aktualnyPradA < 0) {
    errors.push(ujemnaWartosc("aktualnyPradA", "POLE-AKTUALNY-PRAD-L", input.aktualnyPradA))
  }
  if (input.aktualneNapiecieV !== null && input.aktualneNapiecieV < 0) {
    errors.push(ujemnaWartosc("aktualneNapiecieV", "POLE-AKTUALNE-NAPIECIE-L", input.aktualneNapiecieV))
  }
  return { errors }
}
