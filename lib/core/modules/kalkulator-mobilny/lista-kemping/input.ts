/**
 * Ekran 24, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Lista kontrolna na kemping" (dawne 8.47,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.35). Wzorzec E.
 */
export type SezonKempingu = "lato" | "przejsciowy" | "zima"

export type ListaKempingInput = {
  osoby: number
  sezon: SezonKempingu | null
  /** Liczba telefonów/tabletów ładowanych na miejscu. */
  telefony: number
  maPanel: boolean
  maUrzadzenia230: boolean
  maLodowke: boolean
  maOswietlenie: boolean
  maRadio: boolean
  /** Odhaczone pozycje (id). */
  zaznaczoneIds: string[]
}
