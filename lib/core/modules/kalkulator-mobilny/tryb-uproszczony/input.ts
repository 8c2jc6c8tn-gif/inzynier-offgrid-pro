/**
 * Ekran 1, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Tryb uproszczony — dobór akumulatora
 * i odbiorników" (dawne 8.1, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Wzorzec D-lite:
 * to wejście dla kogoś, kto nie chce przechodzić przez pełny proces projektowy — szybka
 * odpowiedź na jedno pytanie.
 */

export type TrybUproszczonyInput = {
  pojemnoscAh: number
  napiecieV: number
  mocOdbiornikaW: number
}
