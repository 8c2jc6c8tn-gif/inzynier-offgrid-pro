import type { Warning } from "@/lib/core/calc-result"
import { U_SANITY_MAX, WYMIANY_SANITY_MAX } from "./constants"
import type { ObciazenieCieplneInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: ObciazenieCieplneInput): Warning[] {
  const e: Warning[] = []
  input.przegrody.forEach((p, i) => {
    const etykieta = p.nazwa || `przegroda ${i + 1}`
    if (p.powierzchniaM2 !== null && p.powierzchniaM2 < 0) {
      e.push(wartoscUjemna(`przegrody.${i}.powierzchniaM2`, `Powierzchnia (${etykieta})`, p.powierzchniaM2))
    }
    if (p.uWM2K !== null && (p.uWM2K < 0 || p.uWM2K > U_SANITY_MAX)) {
      e.push(wartoscPozaZakresem(`przegrody.${i}.uWM2K`, `U (${etykieta})`, p.uWM2K, 0, U_SANITY_MAX))
    }
  })
  if (input.kubaturaM3 !== null && input.kubaturaM3 < 0) e.push(wartoscUjemna("kubaturaM3", "Kubatura", input.kubaturaM3))
  const n = input.wymianyPowietrzaNaH
  if (n !== null && (n < 0 || n > WYMIANY_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("wymianyPowietrzaNaH", "Wymiany powietrza", n, 0, WYMIANY_SANITY_MAX))
  }
  if (input.cop !== null && input.cop <= 0) e.push(wartoscNiedodatnia("cop", "COP", input.cop))
  return e
}
