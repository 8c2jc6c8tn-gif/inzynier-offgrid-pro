import type { Warning } from "@/lib/core/calc-result"
import type { AgregatWMrozieInput } from "./input"
import { wartoscUjemna } from "./warnings"

const ETYKIETY = {
  wymaganyCzasPracyH: "Wymagany czas pracy",
  maxPracaCiaglaH: "Maksymalny czas pracy ciągłej",
  przerwaH: "Przerwa",
  zuzyciePaliwaLH: "Zużycie paliwa",
  interwalWymianyOlejuH: "Interwał wymiany oleju",
  dniPostoju: "Dni postoju",
} as const

export function validateInput(input: AgregatWMrozieInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  return { errors }
}
