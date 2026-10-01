/**
 * Ekran 33, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Test: czy mój akumulator jest jeszcze dobry?"
 * (dawne 8.60, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.48). Wzorzec D.
 */

export type ChemiaTestu = "olow" | "lifepo4"

export type TestAkumulatoraInput = {
  /** null = not chosen yet. "olow" = AGM / flooded / gel. */
  chemia: ChemiaTestu | null
  /** Napięcie znamionowe akumulatora [V] (12, 24...). 0 = jeszcze nie wpisano. */
  napiecieZnamionoweV: number
  /** Napięcie spoczynkowe — po spoczynku bez obciążenia i ładowania [V]. 0 = jeszcze nie wpisano. */
  napiecieSpoczynkoweV: number
  /** Moc znanego obciążenia testowego [W] — opcjonalna; 0 = bez testu obciążeniowego. */
  mocObciazeniaW: number
  /** Napięcie na zaciskach pod tym obciążeniem [V] — opcjonalne; 0 = bez testu obciążeniowego. */
  napiecieObciazenieV: number
  /** Rezystancja wewnętrzna z karty katalogowej [mΩ] — opcjonalna; 0 = nie podano. */
  rezystancjaKartaMOhm: number
}
