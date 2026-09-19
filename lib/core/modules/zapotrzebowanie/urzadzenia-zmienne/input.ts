/**
 * Moduł 2 "Zapotrzebowanie" — Ekran 3 "Urządzenia zmienne + płyta indukcyjna + klasa
 * energetyczna" (scala dawne 1.3, 1.4, 1.5, docs/zrodla/Tresc_Modul_2_Zapotrzebowanie_Ekrany.md,
 * linie 27-40). Wzorzec D.
 */

export type KlasaEnergetyczna = "nowoczesne" | "standardowe" | "stare"

export type PozycjaUrzadzenia = {
  id: string
  wybrane: boolean
  mocW: number
  czasMin: number
  klasa: KlasaEnergetyczna
}

export type UrzadzeniaZmienneInput = {
  urzadzenia: PozycjaUrzadzenia[]
  plytaIndukcyjnaWybrana: boolean
  plytaIndukcyjnaMocW: number
  plytaIndukcyjnaCzasMin: number
}
