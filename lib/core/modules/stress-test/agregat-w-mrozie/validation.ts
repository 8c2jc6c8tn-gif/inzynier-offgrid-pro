import type { Warning } from "@/lib/core/calc-result"
import type { AgregatWMrozieInput } from "./input"
import { wartoscUjemna } from "./warnings"

const ETYKIETY = {
  wymaganyCzasPracyH: "POLE-WYMAGANY-CZAS-PRACY",
  maxPracaCiaglaH: "POLE-MAKSYMALNY-CZAS-PRACY-CIAGLEJ",
  przerwaH: "POLE-PRZERWA",
  zuzyciePaliwaLH: "POLE-ZUZYCIE-PALIWA",
  interwalWymianyOlejuH: "POLE-INTERWAL-WYMIANY-OLEJU",
  dniPostoju: "POLE-DNI-POSTOJU",
} as const

export function validateInput(input: AgregatWMrozieInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  return { errors }
}
