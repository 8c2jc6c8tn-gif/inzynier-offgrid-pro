/**
 * Simple mode of the panel comparer (D81, spec 31): one plain-language recommendation drawn from the numbers the engine already has.
 * Nothing new is computed and no weighting is invented — the verdict is a decision table over three facts the full screen shows too:
 * who gives the most energy in winter (XI–II), who has the lowest cost of a winter kWh over 25 years, and whether the two agree.
 * Winter leads because in an off-grid system it is the season that decides (app philosophy, `docs/standards/00-filozofia.md`).
 */
import type { PorownywarkaResult, ScenariuszWiecejPaneli } from "./calculator"

/**
 * A winter difference below this share of the weaker panel's winter energy counts as "no difference": half a percent is what the
 * screen rounds to 0%, so a difference that would be printed as "0%" is never presented as an advantage.
 */
export const PROG_BEZ_ROZNICY_ZIMA_PROC = 0.5

export type RekomendacjaProsta =
  /** The same panel wins in winter and in cost per winter kWh (or only the winter can be judged and one panel clearly leads). */
  | { rodzaj: "wybierz"; panelId: string; powod: "zima-i-cena" | "zima" }
  /** Winter is a tie; the cheaper winter kWh decides. */
  | { rodzaj: "wybierz"; panelId: string; powod: "cena-przy-remisie" }
  /** Winter is a tie and no prices are known: nothing separates the panels yet. */
  | { rodzaj: "bez-roznicy" }
  /** One panel gives more winter energy, another has the cheaper winter kWh: a trade-off the user decides. */
  | { rodzaj: "kompromis"; liderZimyId: string; najtanszyId: string }

export type WerdyktProsty =
  /** No panel could be computed. */
  | { rodzaj: "brak-wyniku" }
  /** Only one panel is computed, so there is nothing to compare. */
  | { rodzaj: "jeden-panel"; panelId: string }
  | {
      rodzaj: "porownanie"
      rekomendacja: RekomendacjaProsta
      liderZimyId: string
      drugiId: string
      /** Winter energy of the leader above the runner-up [kWh] and as a percentage of the runner-up's winter energy. */
      roznicaZimaKwh: number
      roznicaZimaProc: number
      zimaBezRoznicy: boolean
      /** Value of that difference per year at the user's kWh price; `null` without a price. */
      roznicaZl: number | null
      /** Panel with the lowest cost of a winter kWh among those with a price; `null` unless at least two panels have a price. */
      najtanszyId: string | null
      /** The "cheaper panel = more panels" scenario with the largest winter gain, if any adds panels. */
      scenariusz: ScenariuszWiecejPaneli | null
    }

export function werdyktProsty(wynik: Pick<PorownywarkaResult, "panele" | "roznicaZimowa" | "scenariusze">): WerdyktProsty {
  const { panele, roznicaZimowa } = wynik
  if (panele.length === 0) return { rodzaj: "brak-wyniku" }
  if (panele.length === 1 || roznicaZimowa === null) return { rodzaj: "jeden-panel", panelId: panele[0]!.id }

  const lider = panele.find((p) => p.id === roznicaZimowa.liderId)!
  const drugi = panele.find((p) => p.id === roznicaZimowa.drugiId)!
  const roznicaProc = drugi.zimaKwh > 0 ? (roznicaZimowa.roznicaKwh / drugi.zimaKwh) * 100 : 0
  const zimaBezRoznicy = roznicaProc < PROG_BEZ_ROZNICY_ZIMA_PROC

  const zCena = panele.filter((p) => p.kosztZimowejKwhZl !== null)
  const najtanszy = zCena.length >= 2 ? zCena.reduce((a, b) => (b.kosztZimowejKwhZl! < a.kosztZimowejKwhZl! ? b : a)) : null

  // In a tie only the panels that tie with the leader compete on price: a much weaker panel is never recommended just for being cheap.
  const wRemisie = panele.filter((p) => p.zimaKwh > 0 && ((lider.zimaKwh - p.zimaKwh) / p.zimaKwh) * 100 < PROG_BEZ_ROZNICY_ZIMA_PROC && p.kosztZimowejKwhZl !== null)
  const najtanszyWRemisie = wRemisie.length >= 2 ? wRemisie.reduce((a, b) => (b.kosztZimowejKwhZl! < a.kosztZimowejKwhZl! ? b : a)) : null

  let rekomendacja: RekomendacjaProsta
  if (zimaBezRoznicy) {
    rekomendacja = najtanszyWRemisie === null ? { rodzaj: "bez-roznicy" } : { rodzaj: "wybierz", panelId: najtanszyWRemisie.id, powod: "cena-przy-remisie" }
  } else if (najtanszy === null) {
    rekomendacja = { rodzaj: "wybierz", panelId: lider.id, powod: "zima" }
  } else if (najtanszy.id === lider.id) {
    rekomendacja = { rodzaj: "wybierz", panelId: lider.id, powod: "zima-i-cena" }
  } else {
    rekomendacja = { rodzaj: "kompromis", liderZimyId: lider.id, najtanszyId: najtanszy.id }
  }

  const scenariusz =
    wynik.scenariusze.filter((s) => s.dodatkowePanele > 0 && s.przewagaZimaKwh > 0).sort((a, b) => b.przewagaZimaKwh - a.przewagaZimaKwh)[0] ?? null

  return {
    rodzaj: "porownanie",
    rekomendacja,
    liderZimyId: lider.id,
    drugiId: drugi.id,
    roznicaZimaKwh: roznicaZimowa.roznicaKwh,
    roznicaZimaProc: roznicaProc,
    zimaBezRoznicy,
    roznicaZl: roznicaZimowa.roznicaZl,
    najtanszyId: najtanszy?.id ?? null,
    scenariusz,
  }
}
