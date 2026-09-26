import type { Warning } from "@/lib/core/calc-result"
import { GRUBOSC_SANITY_MAX_CM, LAMBDA_SANITY_MAX, U_SANITY_MAX } from "./constants"
import type { OptymalizacjaIzolacjiInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: OptymalizacjaIzolacjiInput): Warning[] {
  const e: Warning[] = []
  const { powierzchniaM2: a, uWM2K: u } = input.przegroda
  if (a !== null && a <= 0) e.push(wartoscNiedodatnia("powierzchniaM2", "Powierzchnia przegrody", a))
  if (u !== null && u <= 0) e.push(wartoscNiedodatnia("uWM2K", "U przegrody", u))
  else if (u !== null && u > U_SANITY_MAX) e.push(wartoscPozaZakresem("uWM2K", "U przegrody", u, 0, U_SANITY_MAX))
  input.warianty.forEach((w, i) => {
    const etykieta = w.nazwa || `wariant ${i + 1}`
    if (w.lambdaWmK !== null && (w.lambdaWmK <= 0 || w.lambdaWmK > LAMBDA_SANITY_MAX)) {
      e.push(wartoscPozaZakresem(`warianty.${i}.lambdaWmK`, `λ (${etykieta})`, w.lambdaWmK, 0, LAMBDA_SANITY_MAX))
    }
    if (w.gruboscCm !== null && (w.gruboscCm <= 0 || w.gruboscCm > GRUBOSC_SANITY_MAX_CM)) {
      e.push(wartoscPozaZakresem(`warianty.${i}.gruboscCm`, `Grubość (${etykieta})`, w.gruboscCm, 0, GRUBOSC_SANITY_MAX_CM))
    }
    if (w.cenaZlM2 !== null && w.cenaZlM2 < 0) e.push(wartoscUjemna(`warianty.${i}.cenaZlM2`, `Cena (${etykieta})`, w.cenaZlM2))
  })
  if (input.cenaCieplaZlKwh !== null && input.cenaCieplaZlKwh < 0) {
    e.push(wartoscUjemna("cenaCieplaZlKwh", "Cena ciepła", input.cenaCieplaZlKwh))
  }
  return e
}
