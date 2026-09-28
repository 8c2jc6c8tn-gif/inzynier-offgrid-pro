import type { Warning } from "@/lib/core/calc-result"
import type { BlackoutInput } from "./input"
import { procentPozaZakresem, socMinNieMniejszyNizStart, wartoscUjemna } from "./warnings"

const ETYKIETY = {
  pojemnoscKwh: "Pojemność baterii",
  zuzycieDoboweKwh: "Zużycie dobowe",
  dniScenariusza: "Liczba dni",
  agregatKwhDoba: "Energia z agregatu",
} as const

export function validateInput(input: BlackoutInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  for (const pole of ["socStartPct", "socMinPct"] as const) {
    const v = input[pole]
    if (v !== null && (v < 0 || v > 100)) errors.push(procentPozaZakresem(pole, v))
  }
  const eta = input.sprawnoscFalownikaPct
  if (eta !== null && (eta <= 0 || eta > 100)) errors.push(procentPozaZakresem("sprawnoscFalownikaPct", eta))
  if (errors.length === 0 && input.socStartPct !== null && input.socMinPct !== null && input.socMinPct >= input.socStartPct) {
    errors.push(socMinNieMniejszyNizStart(input.socStartPct, input.socMinPct))
  }
  return { errors }
}
