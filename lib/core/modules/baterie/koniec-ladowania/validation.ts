import type { Warning } from "@/lib/core/calc-result"
import type { KoniecLadowaniaInput } from "./input"
import { notPositive, ujemnaWartosc } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: KoniecLadowaniaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscAh < 0) {
    errors.push(notPositive("pojemnoscAh", "pojemność baterii", input.pojemnoscAh))
  }
  if (input.napiecieAbsorpcjiV < 0) {
    errors.push(notPositive("napiecieAbsorpcjiV", "napięcie absorpcji", input.napiecieAbsorpcjiV))
  }
  if (input.progKoncowyC < 0 || input.progKoncowyC > 1) {
    errors.push({
      code: "PROG-KONCOWY-POZA-ZAKRESEM",
      level: "critical",
      message: "Próg prądu końcowego (jako ułamek C) musi być z przedziału 0–1.",
      technicalMessage: `progKoncowyC = ${input.progKoncowyC}, oczekiwano [0, 1]`,
      field: "progKoncowyC",
    })
  }
  if (input.aktualnyPradA !== null && input.aktualnyPradA < 0) {
    errors.push(ujemnaWartosc("aktualnyPradA", "aktualny prąd", input.aktualnyPradA))
  }
  if (input.aktualneNapiecieV !== null && input.aktualneNapiecieV < 0) {
    errors.push(ujemnaWartosc("aktualneNapiecieV", "aktualne napięcie", input.aktualneNapiecieV))
  }
  return { errors }
}
