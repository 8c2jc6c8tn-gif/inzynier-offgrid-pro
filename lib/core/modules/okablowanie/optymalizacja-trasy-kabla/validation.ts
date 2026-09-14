import type { Warning } from "@/lib/core/calc-result"
import type { OptymalizacjaTrasyKablaInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: OptymalizacjaTrasyKablaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pradA < 0) errors.push(wartoscUjemna("pradA", input.pradA))
  if (input.napiecieV < 0) errors.push(wartoscUjemna("napiecieV", input.napiecieV))
  if (input.liczbaKabliWWiazce < 0) errors.push(wartoscUjemna("liczbaKabliWWiazce", input.liczbaKabliWWiazce))
  if (input.dopuszczalnySpadekNapieciaPct < 0) {
    errors.push(wartoscUjemna("dopuszczalnySpadekNapieciaPct", input.dopuszczalnySpadekNapieciaPct))
  }
  if (input.cenaEnergiiZlZaKwh < 0) errors.push(wartoscUjemna("cenaEnergiiZlZaKwh", input.cenaEnergiiZlZaKwh))
  if (input.liczbaLat < 0) errors.push(wartoscUjemna("liczbaLat", input.liczbaLat))
  for (const [nazwa, trasa] of [
    ["trasaA", input.trasaA],
    ["trasaB", input.trasaB],
  ] as const) {
    if (trasa.dlugoscTrasyM < 0) errors.push(wartoscUjemna(`${nazwa}.dlugoscTrasyM`, trasa.dlugoscTrasyM))
    if (trasa.przekrojMm2 < 0) errors.push(wartoscUjemna(`${nazwa}.przekrojMm2`, trasa.przekrojMm2))
    if (trasa.kosztZakupuZl < 0) errors.push(wartoscUjemna(`${nazwa}.kosztZakupuZl`, trasa.kosztZakupuZl))
  }
  return { errors }
}
