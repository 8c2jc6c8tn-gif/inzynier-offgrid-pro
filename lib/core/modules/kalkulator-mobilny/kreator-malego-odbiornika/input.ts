/**
 * Ekran 12, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Kreator zasilania małego odbiornika" (moduł
 * zbiorczy: dawne 8.17–8.19, 8.21, 8.29–8.36, 8.48, 8.52, 8.53, 8.67; docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md,
 * Biblia §12.24). Wzorzec D. Moce, godziny, sprawności i część użyteczna — od usera (Dyrektywa #1).
 */
import type { ScenariuszOdbiornika } from "./constants"

export type SkladnikOdbiornika = {
  nazwa: string
  mocW: number
  /** Godziny pracy na dobę [h] (np. brama: cykle × czas cyklu). */
  godzinNaDobe: number
  /** Krotność rozruchu (silnik, sprężarka); 0 = nie podano (liczone jak 1). */
  krotnoscRozruchu: number
}

export type KreatorMalegoOdbiornikaInput = {
  scenariusz: ScenariuszOdbiornika | null
  skladniki: SkladnikOdbiornika[]
  /** Wymagany czas podtrzymania bez ładowania [h]. */
  czasPodtrzymaniaH: number
  napiecieV: number
  /** Część użyteczna pojemności (DoD) [%]. */
  uzytecznaPct: number
  /** Czy odbiorniki są zasilane przez falownik 230 V; null = nie wybrano. */
  przezFalownik: boolean | null
  /** Sprawność falownika [%] — wymagana tylko przy przezFalownik = true. */
  sprawnoscFalownikaPct: number
  /** Posiadany akumulator [Ah]; 0 = nie sprawdzaj. */
  posiadanyAh: number
  /** Panel (opcjonalnie): moc [W]; 0 = bez panelu. */
  mocPaneluW: number
  godzinSlonca: number
  sprawnoscToruPct: number
}
