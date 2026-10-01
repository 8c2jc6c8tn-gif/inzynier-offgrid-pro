/**
 * Ekran 3, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Gotowe szablony zestawów" (dawne 8.3, 8.16;
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.3, §12.16). Wzorzec A (przełącznik szablonu).
 */
import type { SzablonZestawu } from "./constants"

export type UrzadzenieZestawu = {
  nazwa: string
  mocW: number
  godzinNaDobe: number
  /** Liczone osobno dla każdej osoby (np. ładowarka telefonu). */
  naOsobe: boolean
}

export type SzablonyZestawowInput = {
  szablon: SzablonZestawu
  dni: number
  osoby: number
  urzadzenia: UrzadzenieZestawu[]
  napiecieV: number
  /** Część użyteczna akumulatora (DoD) [%]. */
  dodPct: number
  /** Równoważne godziny pełnego słońca [h/dobę]; 0 = bez doboru panelu. */
  godzinSlonca: number
  /** Sprawność toru panel → akumulator [%]. */
  sprawnoscToruPct: number
}
