import type { Warning } from "@/lib/core/calc-result"
import { CIEPLO_WLASCIWE_SANITY_MAX, CIEPLO_WLASCIWE_SANITY_MIN, GESTOSC_SANITY_MAX_KG_M3, GRUBOSC_SANITY_MAX_CM } from "./constants"
import type { PojemnoscCieplnaInput } from "./input"
import { elementCienszyNizWarstwa, granicaNieNizszaNizStart, wartoscNiedodatnia, wartoscPozaZakresem } from "./warnings"

export function validateInput(input: PojemnoscCieplnaInput): Warning[] {
  const e: Warning[] = []
  input.warstwy.forEach((w, i) => {
    const etykieta = w.nazwa || `warstwa ${i + 1}`
    if (w.powierzchniaM2 !== null && w.powierzchniaM2 <= 0) {
      e.push(wartoscNiedodatnia(`warstwy.${i}.powierzchniaM2`, `Powierzchnia (${etykieta})`, w.powierzchniaM2))
    }
    if (w.gruboscCm !== null && (w.gruboscCm <= 0 || w.gruboscCm > GRUBOSC_SANITY_MAX_CM)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gruboscCm`, `Grubość (${etykieta})`, w.gruboscCm, 0, GRUBOSC_SANITY_MAX_CM))
    }
    if (w.gestoscKgM3 !== null && (w.gestoscKgM3 <= 0 || w.gestoscKgM3 > GESTOSC_SANITY_MAX_KG_M3)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gestoscKgM3`, `Gęstość (${etykieta})`, w.gestoscKgM3, 0, GESTOSC_SANITY_MAX_KG_M3))
    }
    const de = w.gruboscElementuCm ?? null
    if (de !== null && (de <= 0 || de > GRUBOSC_SANITY_MAX_CM)) {
      e.push(wartoscPozaZakresem(`warstwy.${i}.gruboscElementuCm`, `Grubość całej przegrody (${etykieta})`, de, 0, GRUBOSC_SANITY_MAX_CM))
    } else if (de !== null && w.gruboscCm !== null && de < w.gruboscCm) {
      e.push(elementCienszyNizWarstwa(`warstwy.${i}.gruboscElementuCm`, etykieta, de, w.gruboscCm))
    }
    const c = w.cieploWlasciweJKgK
    if (c !== null && (c < CIEPLO_WLASCIWE_SANITY_MIN || c > CIEPLO_WLASCIWE_SANITY_MAX)) {
      e.push(
        wartoscPozaZakresem(`warstwy.${i}.cieploWlasciweJKgK`, `Ciepło właściwe (${etykieta})`, c, CIEPLO_WLASCIWE_SANITY_MIN, CIEPLO_WLASCIWE_SANITY_MAX),
      )
    }
  })
  if (input.kubaturaM3 !== null && input.kubaturaM3 <= 0) e.push(wartoscNiedodatnia("kubaturaM3", "Kubatura", input.kubaturaM3))
  if (input.hZewnetrzneWK !== null && input.hZewnetrzneWK <= 0) {
    e.push(wartoscNiedodatnia("hZewnetrzneWK", "Współczynnik strat na zewnątrz", input.hZewnetrzneWK))
  }
  const { temperaturaPoczatkowaC: t0, temperaturaGranicznaC: tg } = input
  if (t0 !== null && tg !== null && tg >= t0) e.push(granicaNieNizszaNizStart(tg, t0))
  return e
}
