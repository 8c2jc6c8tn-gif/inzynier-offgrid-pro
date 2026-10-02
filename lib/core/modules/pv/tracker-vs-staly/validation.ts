import type { Warning } from "@/lib/core/calc-result"
import type { TrackerVsStalyInput } from "./input"
import { wartoscUjemna } from "../zloty-srodek/warnings"
import { liczbaNiecalkowita } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

const POLA: ReadonlyArray<[keyof TrackerVsStalyInput, string]> = [
  ["liczbaPaneliTracker", "POLE-LICZBA-PANELI-TRACKER"],
  ["kosztTrackeraZl", "POLE-KOSZT-TRACKERA"],
  ["kosztPaneluZl", "POLE-KOSZT-PANELU"],
  ["uzyskPaneluKwh", "POLE-UZYSK-PANELU"],
]

export function validateInput(input: TrackerVsStalyInput): ValidationResult {
  const errors: Warning[] = []
  for (const [pole, etykieta] of POLA) {
    if (input[pole] < 0) errors.push(wartoscUjemna(pole, etykieta, input[pole]))
  }
  if (input.liczbaPaneliTracker >= 0 && !Number.isInteger(input.liczbaPaneliTracker)) {
    errors.push(liczbaNiecalkowita("liczbaPaneliTracker", "POLE-LICZBA-PANELI-TRACKER", input.liczbaPaneliTracker))
  }
  return { errors }
}
