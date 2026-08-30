/**
 * Ekran 11, Moduł 3 "Instalacja PV" — "Konfigurator stringów: szereg / równolegle / mieszany"
 * (dawne 2.19, 2.20, 2.21 — scalone, docs/domena/Tresc_Modul_3_PV_Ekrany.md).
 * Wzorzec A — przełącznik trybu: trzy sposoby połączenia tych samych paneli,
 * matematycznie równoważne (docs/standards/08-ui-ux.md, 8.2).
 */

export type SeriesInput = {
  mode: "szereg"
  /** Napięcie w punkcie mocy maksymalnej pojedynczego panelu [V], z karty katalogowej. */
  vmpV: number
  /** Prąd w punkcie mocy maksymalnej pojedynczego panelu [A]. */
  impA: number
  liczbaPaneli: number
}

export type ParallelInput = {
  mode: "rownolegle"
  vmpV: number
  impA: number
  liczbaPaneli: number
}

export type MixedInput = {
  mode: "mieszany"
  vmpV: number
  impA: number
  /** Liczba paneli połączonych szeregowo w jednej grupie. */
  panelWGrupie: number
  /** Liczba takich grup połączonych równolegle. */
  liczbaGrup: number
}

export type KonfiguratorStringowInput = SeriesInput | ParallelInput | MixedInput
