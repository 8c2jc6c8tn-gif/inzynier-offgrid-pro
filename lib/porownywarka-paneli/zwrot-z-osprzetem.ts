/**
 * Payback and the cost of a winter kWh with the device and accessories added to the panel price (opt-in switch in "Profitability").
 * The engine prices the panels only; this layer scales its two figures by the ratio (panels + extras) / panels, which is exact because
 * both are the price divided by an amount that does not depend on the price: the payback by the yearly value, the cost of a winter kWh
 * by the 25-year winter energy. The extras are a range (the accessory price list is a range), so the result is a range too.
 */
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { PanelNaUrzadzeniu } from "./urzadzenie"

export type ZwrotZOsprzetem = {
  /** Panels + device (if its price was typed) + accessories [display currency]. */
  cenaMin: number
  cenaMax: number
  okresZwrotuMinLat: number | null
  okresZwrotuMaxLat: number | null
  kosztZimowejKwhMin: number | null
  kosztZimowejKwhMax: number | null
  /** An accessory line that is switched on has no quantity (e.g. the cable run was not typed), so the sum misses it. */
  niepelny: boolean
}

/** `null` = no result with accessories: no chosen layout for this panel, or no panel price (a zero price cannot be scaled). */
export function zwrotZOsprzetem(p: WynikPanelu, na: PanelNaUrzadzeniu | undefined): ZwrotZOsprzetem | null {
  if (!na || na.wybrany === null || p.cenaRazemZl === null || !(p.cenaRazemZl > 0)) return null
  const dodatekMin = na.kosztUrzadzen + (na.bos?.sumaMin ?? 0)
  const dodatekMax = na.kosztUrzadzen + (na.bos?.sumaMax ?? 0)
  const skalaMin = (p.cenaRazemZl + dodatekMin) / p.cenaRazemZl
  const skalaMax = (p.cenaRazemZl + dodatekMax) / p.cenaRazemZl
  return {
    cenaMin: p.cenaRazemZl + dodatekMin,
    cenaMax: p.cenaRazemZl + dodatekMax,
    okresZwrotuMinLat: p.okresZwrotuLat === null ? null : p.okresZwrotuLat * skalaMin,
    okresZwrotuMaxLat: p.okresZwrotuLat === null ? null : p.okresZwrotuLat * skalaMax,
    kosztZimowejKwhMin: p.kosztZimowejKwhZl === null ? null : p.kosztZimowejKwhZl * skalaMin,
    kosztZimowejKwhMax: p.kosztZimowejKwhZl === null ? null : p.kosztZimowejKwhZl * skalaMax,
    niepelny: (na.bos?.brakIlosci.length ?? 0) > 0,
  }
}

/** Per panel id; panels without a result map to `null`. */
export function zwrotyZOsprzetem(panele: readonly WynikPanelu[], naUrzadzeniu: readonly PanelNaUrzadzeniu[]): Map<string, ZwrotZOsprzetem | null> {
  return new Map(panele.map((p) => [p.id, zwrotZOsprzetem(p, naUrzadzeniu.find((x) => x.wynik.id === p.id))]))
}
