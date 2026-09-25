import type { Warning } from "@/lib/core/calc-result"
import type { TrackerVsStalyInput } from "./input"
import { wartoscUjemna } from "../zloty-srodek/warnings"
import { liczbaNiecalkowita } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

const POLA: ReadonlyArray<[keyof TrackerVsStalyInput, string]> = [
  ["liczbaPaneliTracker", "Liczba paneli na trackerze"],
  ["kosztTrackeraZl", "Koszt trackera"],
  ["kosztPaneluZl", "Koszt dodatkowego panelu"],
  ["uzyskPaneluKwh", "Roczny uzysk jednego panelu"],
]

export function validateInput(input: TrackerVsStalyInput): ValidationResult {
  const errors: Warning[] = []
  for (const [pole, etykieta] of POLA) {
    if (input[pole] < 0) errors.push(wartoscUjemna(pole, etykieta, input[pole]))
  }
  if (input.liczbaPaneliTracker >= 0 && !Number.isInteger(input.liczbaPaneliTracker)) {
    errors.push(liczbaNiecalkowita("liczbaPaneliTracker", "Liczba paneli na trackerze", input.liczbaPaneliTracker))
  }
  return { errors }
}
