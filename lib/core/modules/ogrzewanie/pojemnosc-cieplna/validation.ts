import type { Warning } from "@/lib/core/calc-result"
import { nazwaElementu } from "@/lib/core/nazwa-elementu"
import { CIEPLO_WLASCIWE_SANITY_MAX, CIEPLO_WLASCIWE_SANITY_MIN, GESTOSC_SANITY_MAX_KG_M3, GRUBOSC_SANITY_MAX_CM } from "./constants"
import type { PojemnoscCieplnaInput } from "./input"
import { elementCienszyNizWarstwa, granicaNieNizszaNizStart, wartoscNiedodatnia, wartoscPozaZakresem } from "./warnings"

export function validateInput(input: PojemnoscCieplnaInput): Warning[] {
  const e: Warning[] = []
  input.warstwy.forEach((w, i) => {
    const etykieta = nazwaElementu("przegroda", w.nazwa, "NAZWA-WARSTWA-NR", i + 1)
    if (w.powierzchniaM2 !== null && w.powierzchniaM2 <= 0) {
      e.push(wartoscNiedodatnia(`warstwy.${i}.powierzchniaM2`, "POLE-POWIERZCHNIA-PRZEGRODY", w.powierzchniaM2, etykieta))
    }
    if (w.gruboscCm !== null && (w.gruboscCm <= 0 || w.gruboscCm > GRUBOSC_SANITY_MAX_CM)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gruboscCm`, "POLE-GRUBOSC-WARSTWY", w.gruboscCm, 0, GRUBOSC_SANITY_MAX_CM, etykieta))
    }
    if (w.gestoscKgM3 !== null && (w.gestoscKgM3 <= 0 || w.gestoscKgM3 > GESTOSC_SANITY_MAX_KG_M3)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gestoscKgM3`, "POLE-GESTOSC-WARSTWY", w.gestoscKgM3, 0, GESTOSC_SANITY_MAX_KG_M3, etykieta))
    }
    const de = w.gruboscElementuCm ?? null
    if (de !== null && (de <= 0 || de > GRUBOSC_SANITY_MAX_CM)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gruboscElementuCm`, "POLE-GRUBOSC-CALEJ-PRZEGRODY", de, 0, GRUBOSC_SANITY_MAX_CM, etykieta))
    } else if (de !== null && w.gruboscCm !== null && de < w.gruboscCm) {
      e.push(elementCienszyNizWarstwa(`warstwy.${i}.gruboscElementuCm`, nazwaElementu("nazwa", w.nazwa, "NAZWA-WARSTWA-NR", i + 1), de, w.gruboscCm))
    }
    const c = w.cieploWlasciweJKgK
    if (c !== null && (c < CIEPLO_WLASCIWE_SANITY_MIN || c > CIEPLO_WLASCIWE_SANITY_MAX)) {
      e.push(
        wartoscPozaZakresem(`warstwy.${i}.cieploWlasciweJKgK`, "POLE-CIEPLO-WLASCIWE-WARSTWY", c, CIEPLO_WLASCIWE_SANITY_MIN, CIEPLO_WLASCIWE_SANITY_MAX, etykieta),
      )
    }
  })
  if (input.kubaturaM3 !== null && input.kubaturaM3 <= 0) e.push(wartoscNiedodatnia("kubaturaM3", "POLE-KUBATURA", input.kubaturaM3))
  if (input.hZewnetrzneWK !== null && input.hZewnetrzneWK <= 0) {
    e.push(wartoscNiedodatnia("hZewnetrzneWK", "POLE-WSPOLCZYNNIK-STRAT-NA-ZEWNATRZ", input.hZewnetrzneWK))
  }
  const { temperaturaPoczatkowaC: t0, temperaturaGranicznaC: tg } = input
  if (t0 !== null && tg !== null && tg >= t0) e.push(granicaNieNizszaNizStart(tg, t0))
  return e
}
