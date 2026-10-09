/**
 * Offer versions A/B/C on the printout of the panel comparison (spec 29): each version is one of the compared panels with an
 * optional short label ("economical", "recommended"…) and at most one version is marked as the recommended one. Only a choice of
 * what to print — every number on the sheet still comes from the same result as on the screen.
 */
import type { WynikPanelu } from "@/lib/core/modules/pv/porownywarka-paneli/calculator"
import type { FormularzStan, WersjaOfertySeed } from "./stan"

export const LITERY_WERSJI = ["A", "B", "C"] as const
export type LiteraWersji = (typeof LITERY_WERSJI)[number]

export type WersjaOferty = {
  litera: LiteraWersji
  panel: WynikPanelu
  etykieta: string
  zalecana: boolean
}

/** The three slots as edited on the screen: until the user touches them, A, B and C are the first three compared panels, unlabelled. */
export function slotyWersji(stan: Pick<FormularzStan, "ofertaWersje">, panele: readonly Pick<WynikPanelu, "id">[]): WersjaOfertySeed[] {
  return LITERY_WERSJI.map((_, i) => stan.ofertaWersje?.[i] ?? { panelId: stan.ofertaWersje ? "" : (panele[i]?.id ?? ""), etykieta: "" })
}

/** Versions to print, in the order A, B, C. An empty slot, a panel that is no longer compared and a panel already taken by an earlier slot are skipped. */
export function wersjeOferty(stan: Pick<FormularzStan, "ofertaWersje" | "ofertaZalecana">, panele: readonly WynikPanelu[]): WersjaOferty[] {
  const uzyte = new Set<string>()
  return slotyWersji(stan, panele).flatMap((slot, i) => {
    const panel = panele.find((p) => p.id === slot.panelId)
    if (!panel || uzyte.has(panel.id)) return []
    uzyte.add(panel.id)
    const litera = LITERY_WERSJI[i]!
    return [{ litera, panel, etykieta: slot.etykieta.trim(), zalecana: stan.ofertaZalecana === litera }]
  })
}
