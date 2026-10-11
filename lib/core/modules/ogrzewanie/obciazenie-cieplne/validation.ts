import type { Warning } from "@/lib/core/calc-result"
import { nazwaElementu } from "@/lib/core/nazwa-elementu"
import { U_SANITY_MAX, WYMIANY_SANITY_MAX } from "./constants"
import type { ObciazenieCieplneInput } from "./input"
import { wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: ObciazenieCieplneInput): Warning[] {
  const e: Warning[] = []
  input.przegrody.forEach((p, i) => {
    const etykieta = nazwaElementu("przegroda", p.nazwa, "NAZWA-PRZEGRODA-NR", i + 1)
    if (p.powierzchniaM2 !== null && p.powierzchniaM2 < 0) {
      e.push(wartoscUjemna(`przegrody.${i}.powierzchniaM2`, "POLE-POWIERZCHNIA-PRZEGRODY", p.powierzchniaM2, etykieta))
    }
    if (p.uWM2K !== null && (p.uWM2K < 0 || p.uWM2K > U_SANITY_MAX)) {
      e.push(wartoscPozaZakresem(`przegrody.${i}.uWM2K`, "POLE-U-PRZEGRODY", p.uWM2K, 0, U_SANITY_MAX, etykieta))
    }
    p.warstwy?.forEach((w, j) => {
      const pole = `przegrody.${i}.warstwy.${j}`
      if (w.gruboscMm !== null && w.gruboscMm <= 0) e.push(wartoscNiedodatnia(`${pole}.gruboscMm`, "POLE-WARSTWA-GRUBOSC", w.gruboscMm, etykieta))
      if (w.lambdaWmK !== null && w.lambdaWmK <= 0) e.push(wartoscNiedodatnia(`${pole}.lambdaWmK`, "POLE-WARSTWA-LAMBDA", w.lambdaWmK, etykieta))
      if (w.oporM2KW !== null && w.oporM2KW <= 0) e.push(wartoscNiedodatnia(`${pole}.oporM2KW`, "POLE-WARSTWA-OPOR", w.oporM2KW, etykieta))
    })
  })
  if (input.kubaturaM3 !== null && input.kubaturaM3 < 0) e.push(wartoscUjemna("kubaturaM3", "POLE-KUBATURA", input.kubaturaM3))
  const n = input.wymianyPowietrzaNaH
  if (n !== null && (n < 0 || n > WYMIANY_SANITY_MAX)) {
    e.push(wartoscPozaZakresem("wymianyPowietrzaNaH", "POLE-WYMIANY-POWIETRZA", n, 0, WYMIANY_SANITY_MAX))
  }
  if (input.cop !== null && input.cop <= 0) e.push(wartoscNiedodatnia("cop", "POLE-COP", input.cop))
  const odzysk = input.sprawnoscOdzyskuPct ?? null
  if (odzysk !== null && (odzysk < 0 || odzysk > 100)) e.push(wartoscPozaZakresem("sprawnoscOdzyskuPct", "POLE-ODZYSK-WENTYLACJI", odzysk, 0, 100))
  const p = input.paliwo
  if (p) {
    if (p.wartoscOpalowaKwh !== null && p.wartoscOpalowaKwh <= 0) e.push(wartoscNiedodatnia("paliwo.wartoscOpalowaKwh", "POLE-PALIWO-WARTOSC-OPALOWA", p.wartoscOpalowaKwh))
    if (p.sprawnoscPct !== null && (p.sprawnoscPct <= 0 || p.sprawnoscPct > 100)) {
      e.push(wartoscPozaZakresem("paliwo.sprawnoscPct", "POLE-PALIWO-SPRAWNOSC", p.sprawnoscPct, 0, 100))
    }
    if (p.zapas !== null && p.zapas < 0) e.push(wartoscUjemna("paliwo.zapas", "POLE-PALIWO-ZAPAS", p.zapas))
  }
  return e
}
